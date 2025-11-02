import { Injectable, BadRequestException, InternalServerException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Anthropic from '@anthropic-ai/sdk';
import { ChatConversation } from '../entities/chat-conversation.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { CreateConversationDto, SendMessageDto, RegenerateMessageDto } from '../dto/ai-tutor.dto';

export interface TutorResponse {
  message: string;
  conversation_id: string;
  message_id: string;
  model: string;
  tokens_used: number;
  sources?: string[];
}

@Injectable()
export class AITutorService {
  private anthropic: Anthropic;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly systemPrompt: string;

  constructor(
    @InjectRepository(ChatConversation)
    private readonly conversationRepository: Repository<ChatConversation>,
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
  ) {
    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('ANTHROPIC_API_KEY not set. AI Tutor will not function.');
    }

    this.anthropic = new Anthropic({
      apiKey: apiKey || 'dummy-key',
    });

    this.model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
    this.maxTokens = parseInt(process.env.ANTHROPIC_MAX_TOKENS || '4096', 10);

    // System prompt for medical education tutor
    this.systemPrompt = `You are an expert medical education tutor for MedAtlas, an educational platform. Your role is to:

1. **Teach using the Socratic method**: Ask guiding questions rather than giving direct answers immediately. Help students discover answers through reasoning.

2. **Provide evidence-based information**: Always cite reputable medical sources when making clinical claims. Reference medical textbooks, peer-reviewed journals, and clinical guidelines.

3. **Adapt to the student's level**: Assess the student's knowledge level from their questions and adjust explanations accordingly. Use appropriate medical terminology but explain complex concepts clearly.

4. **Focus on understanding, not memorization**: Help students understand underlying mechanisms, pathophysiology, and clinical reasoning rather than just facts.

5. **Use clinical correlations**: Connect basic science concepts to real clinical scenarios to enhance learning and retention.

6. **Be encouraging but rigorous**: Praise correct reasoning, gently correct misconceptions, and encourage critical thinking.

7. **Break down complex topics**: Use analogies, diagrams descriptions, and step-by-step explanations for difficult concepts.

8. **Flag dangerous misconceptions**: If a student has a potentially dangerous misunderstanding about patient care, immediately and clearly correct it.

9. **Recommend additional resources**: When appropriate, suggest textbook chapters, review articles, or practice questions.

10. **Stay within scope**: Focus on medical education. Decline to provide specific medical advice about real patients or personal health concerns.

Format your responses clearly with:
- Short paragraphs
- Bullet points for lists
- **Bold** for key terms
- Clear section headers when explaining multi-part concepts

Always maintain a supportive, professional tone that encourages learning.`;
  }

  /**
   * Create a new conversation
   */
  async createConversation(createDto: CreateConversationDto, userId: string): Promise<ChatConversation> {
    const conversation = this.conversationRepository.create({
      user_id: userId,
      course_id: createDto.course_id,
      title: createDto.title || 'New Conversation',
      context_type: createDto.context_type || 'general',
      context_id: createDto.context_id,
      is_archived: false,
    });

    return this.conversationRepository.save(conversation);
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string, userId: string): Promise<ChatConversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, user_id: userId },
    });

    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }

    return conversation;
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(
    userId: string,
    courseId?: string,
    limit: number = 50,
  ): Promise<ChatConversation[]> {
    const query = this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.user_id = :userId', { userId })
      .andWhere('conversation.is_archived = false')
      .orderBy('conversation.updated_at', 'DESC')
      .limit(limit);

    if (courseId) {
      query.andWhere('conversation.course_id = :courseId', { courseId });
    }

    return query.getMany();
  }

  /**
   * Get conversation messages
   */
  async getConversationMessages(
    conversationId: string,
    userId: string,
    limit: number = 100,
  ): Promise<ChatMessage[]> {
    // Verify user owns conversation
    await this.getConversation(conversationId, userId);

    return this.messageRepository.find({
      where: { conversation_id: conversationId },
      order: { created_at: 'ASC' },
      take: limit,
    });
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(sendDto: SendMessageDto, userId: string): Promise<TutorResponse> {
    const { conversation_id, message, include_context } = sendDto;

    // Verify conversation exists and user owns it
    await this.getConversation(conversation_id, userId);

    // Save user message
    const userMessage = await this.saveMessage(conversation_id, 'user', message);

    // Get conversation history
    const history = await this.getConversationMessages(conversation_id, userId);

    // Build messages for Claude
    const messages = history
      .filter((msg) => msg.id !== userMessage.id) // Exclude the message we just saved
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    });

    try {
      // Call Claude API
      const response = await this.anthropic.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        system: this.systemPrompt,
        messages: messages,
      });

      // Extract text from response
      const assistantMessage = response.content
        .filter((block) => block.type === 'text')
        .map((block) => (block as any).text)
        .join('\n');

      // Save assistant response
      const assistantMsg = await this.saveMessage(
        conversation_id,
        'assistant',
        assistantMessage,
        {
          model: this.model,
          tokens: response.usage.output_tokens,
          input_tokens: response.usage.input_tokens,
          stop_reason: response.stop_reason,
        },
      );

      // Update conversation title if it's the first exchange
      if (messages.length <= 2) {
        await this.updateConversationTitle(conversation_id, message);
      }

      // Update conversation timestamp
      await this.conversationRepository.update(conversation_id, {
        updated_at: new Date(),
      });

      return {
        message: assistantMessage,
        conversation_id,
        message_id: assistantMsg.id,
        model: this.model,
        tokens_used: response.usage.output_tokens,
      };
    } catch (error) {
      console.error('Error calling Claude API:', error);
      
      // Save error message for debugging
      await this.saveMessage(
        conversation_id,
        'system',
        `Error: ${error.message}`,
        { error: true },
      );

      throw new InternalServerException(
        'Failed to get response from AI tutor. Please try again.',
      );
    }
  }

  /**
   * Regenerate last assistant response
   */
  async regenerateMessage(regenerateDto: RegenerateMessageDto, userId: string): Promise<TutorResponse> {
    const { conversation_id, message_id } = regenerateDto;

    // Verify conversation
    await this.getConversation(conversation_id, userId);

    // Get all messages up to the one to regenerate
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.conversation_id = :conversationId', { conversationId: conversation_id })
      .andWhere('message.created_at < (SELECT created_at FROM chat_messages WHERE id = :messageId)', {
        messageId: message_id,
      })
      .orderBy('message.created_at', 'ASC')
      .getMany();

    if (messages.length === 0) {
      throw new BadRequestException('Cannot regenerate first message');
    }

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === 'user');
    if (!lastUserMessage) {
      throw new BadRequestException('No user message found to regenerate response for');
    }

    // Delete the message to regenerate and any after it
    await this.messageRepository
      .createQueryBuilder()
      .delete()
      .where('conversation_id = :conversationId', { conversationId: conversation_id })
      .andWhere('created_at >= (SELECT created_at FROM chat_messages WHERE id = :messageId)', {
        messageId: message_id,
      })
      .execute();

    // Regenerate response
    return this.sendMessage(
      {
        conversation_id,
        message: lastUserMessage.content,
      },
      userId,
    );
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId: string, userId: string): Promise<void> {
    await this.getConversation(conversationId, userId);
    await this.conversationRepository.update(conversationId, { is_archived: true });
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    await this.getConversation(conversationId, userId);
    // Messages will be cascade deleted due to foreign key constraint
    await this.conversationRepository.delete(conversationId);
  }

  /**
   * Get conversation statistics
   */
  async getConversationStats(conversationId: string, userId: string) {
    await this.getConversation(conversationId, userId);

    const messages = await this.messageRepository.find({
      where: { conversation_id: conversationId },
    });

    const userMessages = messages.filter((m) => m.role === 'user').length;
    const assistantMessages = messages.filter((m) => m.role === 'assistant').length;
    const totalTokens = messages.reduce((sum, m) => sum + (m.token_count || 0), 0);

    return {
      total_messages: messages.length,
      user_messages: userMessages,
      assistant_messages: assistantMessages,
      total_tokens: totalTokens,
      created_at: messages[0]?.created_at,
      last_message_at: messages[messages.length - 1]?.created_at,
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Save a message to the database
   */
  private async saveMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata: Record<string, any> = {},
  ): Promise<ChatMessage> {
    const message = this.messageRepository.create({
      conversation_id: conversationId,
      role,
      content,
      metadata,
      token_count: this.estimateTokenCount(content),
    });

    return this.messageRepository.save(message);
  }

  /**
   * Update conversation title based on first message
   */
  private async updateConversationTitle(conversationId: string, firstMessage: string): Promise<void> {
    // Generate a short title from first message (first 50 chars)
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
    await this.conversationRepository.update(conversationId, { title });
  }

  /**
   * Estimate token count (rough approximation: 1 token ≈ 4 characters)
   */
  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
