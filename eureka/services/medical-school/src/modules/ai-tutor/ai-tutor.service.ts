import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import {
  CreateConversationDto,
  SendMessageDto,
  RegenerateMessageDto,
} from './dto/ai-tutor.dto';

// Mock storage (will be replaced with database)
const conversations = new Map();
const messages = new Map();

@Injectable()
export class AITutorService {
  private anthropic: Anthropic;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly systemPrompt: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      console.warn('ANTHROPIC_API_KEY not set. AI Tutor will use mock responses.');
    }

    this.anthropic = new Anthropic({
      apiKey: apiKey || 'dummy-key',
    });

    this.model = this.configService.get('ANTHROPIC_MODEL', 'claude-sonnet-4-20250514');
    this.maxTokens = parseInt(this.configService.get('ANTHROPIC_MAX_TOKENS', '4096'), 10);

    this.systemPrompt = `You are an expert medical education tutor for EUREKA's Medical Education Platform. Your role is to:

1. **Teach using the Socratic method**: Ask guiding questions rather than giving direct answers immediately.
2. **Provide evidence-based information**: Cite reputable medical sources when making clinical claims.
3. **Adapt to the student's level**: Assess knowledge level and adjust explanations accordingly.
4. **Focus on understanding**: Help students understand mechanisms and clinical reasoning, not just facts.
5. **Use clinical correlations**: Connect basic science to real clinical scenarios.
6. **Be encouraging but rigorous**: Praise correct reasoning, gently correct misconceptions.
7. **Break down complex topics**: Use analogies and step-by-step explanations.
8. **Flag dangerous misconceptions**: Immediately correct potentially dangerous misunderstandings.
9. **Stay within scope**: Focus on medical education, decline specific medical advice about real patients.

Format responses with:
- Short paragraphs
- Bullet points for lists
- **Bold** for key terms
- Clear section headers for multi-part concepts`;
  }

  async createConversation(createDto: CreateConversationDto, userId: string) {
    const conversation = {
      id: this.generateUUID(),
      user_id: userId,
      course_id: createDto.course_id,
      title: createDto.title || 'New Conversation',
      context_type: createDto.context_type || 'general',
      context_id: createDto.context_id,
      is_archived: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    conversations.set(conversation.id, conversation);
    return conversation;
  }

  async getConversation(conversationId: string, userId: string) {
    const conversation = conversations.get(conversationId);
    if (!conversation || conversation.user_id !== userId) {
      throw new BadRequestException('Conversation not found');
    }
    return conversation;
  }

  async getUserConversations(userId: string, courseId?: string, limit: number = 50) {
    const userConvs = Array.from(conversations.values())
      .filter(conv => conv.user_id === userId && !conv.is_archived)
      .filter(conv => !courseId || conv.course_id === courseId)
      .sort((a, b) => b.updated_at - a.updated_at)
      .slice(0, limit);

    return userConvs;
  }

  async getConversationMessages(conversationId: string, userId: string, limit: number = 100) {
    await this.getConversation(conversationId, userId);

    const convMessages = Array.from(messages.values())
      .filter(msg => msg.conversation_id === conversationId)
      .sort((a, b) => a.created_at - b.created_at)
      .slice(0, limit);

    return convMessages;
  }

  async sendMessage(sendDto: SendMessageDto, userId: string) {
    const { conversation_id, message } = sendDto;

    await this.getConversation(conversation_id, userId);

    // Save user message
    const userMessage = {
      id: this.generateUUID(),
      conversation_id,
      role: 'user',
      content: message,
      metadata: {},
      token_count: this.estimateTokenCount(message),
      created_at: new Date(),
    };
    messages.set(userMessage.id, userMessage);

    // Get conversation history
    const history = await this.getConversationMessages(conversation_id, userId);

    try {
      // Call Claude API if key is set, otherwise return mock response
      const apiKey = this.configService.get('ANTHROPIC_API_KEY');
      let assistantMessage: string;
      let tokensUsed = 0;

      if (apiKey && apiKey !== 'dummy-key') {
        const claudeMessages = history.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));

        const response = await this.anthropic.messages.create({
          model: this.model,
          max_tokens: this.maxTokens,
          system: this.systemPrompt,
          messages: claudeMessages,
        });

        assistantMessage = response.content
          .filter(block => block.type === 'text')
          .map(block => (block as any).text)
          .join('\n');

        tokensUsed = response.usage.output_tokens;
      } else {
        // Mock response for demonstration
        assistantMessage = this.getMockResponse(message);
        tokensUsed = this.estimateTokenCount(assistantMessage);
      }

      // Save assistant response
      const assistantMsg = {
        id: this.generateUUID(),
        conversation_id,
        role: 'assistant',
        content: assistantMessage,
        metadata: {
          model: this.model,
          tokens: tokensUsed,
        },
        token_count: tokensUsed,
        created_at: new Date(),
      };
      messages.set(assistantMsg.id, assistantMsg);

      // Update conversation title if first exchange
      if (history.length <= 2) {
        const conversation = conversations.get(conversation_id);
        conversation.title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
        conversation.updated_at = new Date();
      }

      return {
        message: assistantMessage,
        conversation_id,
        message_id: assistantMsg.id,
        model: this.model,
        tokens_used: tokensUsed,
      };
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new InternalServerErrorException(
        'Failed to get response from AI tutor. Please try again.',
      );
    }
  }

  async regenerateMessage(regenerateDto: RegenerateMessageDto, userId: string) {
    const { conversation_id, message_id } = regenerateDto;

    await this.getConversation(conversation_id, userId);

    // Get all messages up to the one to regenerate
    const allMessages = await this.getConversationMessages(conversation_id, userId, 1000);
    const messageIndex = allMessages.findIndex(m => m.id === message_id);

    if (messageIndex === -1) {
      throw new BadRequestException('Message not found');
    }

    // Find the last user message before this one
    const lastUserMessage = [...allMessages.slice(0, messageIndex)]
      .reverse()
      .find(m => m.role === 'user');

    if (!lastUserMessage) {
      throw new BadRequestException('No user message found to regenerate response for');
    }

    // Delete messages from the regenerate point onwards
    allMessages.slice(messageIndex).forEach(msg => messages.delete(msg.id));

    // Regenerate response
    return this.sendMessage(
      {
        conversation_id,
        message: lastUserMessage.content,
      },
      userId,
    );
  }

  async archiveConversation(conversationId: string, userId: string) {
    const conversation = await this.getConversation(conversationId, userId);
    conversation.is_archived = true;
    conversation.updated_at = new Date();
  }

  async deleteConversation(conversationId: string, userId: string) {
    await this.getConversation(conversationId, userId);

    // Delete all messages
    Array.from(messages.values())
      .filter(msg => msg.conversation_id === conversationId)
      .forEach(msg => messages.delete(msg.id));

    // Delete conversation
    conversations.delete(conversationId);
  }

  async getConversationStats(conversationId: string, userId: string) {
    await this.getConversation(conversationId, userId);

    const convMessages = await this.getConversationMessages(conversationId, userId, 1000);
    const userMessages = convMessages.filter(m => m.role === 'user').length;
    const assistantMessages = convMessages.filter(m => m.role === 'assistant').length;
    const totalTokens = convMessages.reduce((sum, m) => sum + (m.token_count || 0), 0);

    return {
      total_messages: convMessages.length,
      user_messages: userMessages,
      assistant_messages: assistantMessages,
      total_tokens: totalTokens,
      created_at: convMessages[0]?.created_at,
      last_message_at: convMessages[convMessages.length - 1]?.created_at,
    };
  }

  // Helper Methods

  private getMockResponse(userMessage: string): string {
    const messageLower = userMessage.toLowerCase();

    if (messageLower.includes('artery') || messageLower.includes('vein')) {
      return `Great question! The main differences between **arteries** and **veins** are:

1. **Direction of blood flow**: Arteries carry blood AWAY from the heart, while veins carry blood TOWARD the heart.

2. **Pressure**: Arteries have higher pressure because they receive blood directly from the heart's pumping action. Veins have lower pressure.

3. **Wall structure**: Arteries have thicker, more muscular walls to withstand high pressure. Veins have thinner walls and contain valves to prevent backflow of blood.

4. **Oxygen content**: Most arteries carry oxygenated blood (except pulmonary arteries), while most veins carry deoxygenated blood (except pulmonary veins).

5. **Color**: Due to oxygen content, arterial blood appears bright red, while venous blood appears darker red or blue.

Would you like me to explain any of these differences in more detail, or discuss the clinical significance?`;
    }

    return `Thank you for your question about: "${userMessage}"

As your AI medical tutor, I'd be happy to help you understand this concept better. However, I currently don't have access to my full knowledge base in this demonstration mode.

In a production environment with a proper ANTHROPIC_API_KEY configured, I would:
- Provide detailed, evidence-based explanations
- Use the Socratic method to guide your learning
- Connect concepts to clinical scenarios
- Cite relevant medical literature

For now, I can confirm that I'm ready to assist with medical education topics once the API key is configured in the system environment.

Is there anything else you'd like to know?`;
  }

  private estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
