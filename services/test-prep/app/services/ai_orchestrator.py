"""
EUREKA Test Prep - AI Orchestrator Service
Integrates with OpenAI/Anthropic for intelligent content generation

Ported from ai-orchestrator.ts with full implementation
"""
from typing import List, Dict, Optional
from dataclasses import dataclass
import os
import json


@dataclass
class GeneratedQuestion:
    """AI-generated question structure"""
    stem: str
    choices: List[str]
    correct_index: int
    explanation: str
    difficulty: str
    irt_params: Dict[str, float]
    topics: List[str]
    cognitive_level: str


@dataclass
class ExplanationRequest:
    """Request for personalized explanation"""
    question: str
    choices: List[str]
    correct_answer: int
    user_answer: int
    topic: str


class AIOrchestrator:
    """
    AI-powered content generation and analysis service

    Features:
    - Question generation with IRT parameters
    - Personalized explanations
    - Study plan recommendations
    - Performance analysis
    """

    def __init__(self):
        """Initialize AI clients"""
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.anthropic_api_key = os.getenv('ANTHROPIC_API_KEY')

        # Initialize clients only if keys are available
        self.openai_client = None
        self.anthropic_client = None

        if self.openai_api_key:
            try:
                import openai
                self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
            except ImportError:
                print("OpenAI library not installed. Install with: pip install openai")

        if self.anthropic_api_key:
            try:
                import anthropic
                self.anthropic_client = anthropic.Anthropic(api_key=self.anthropic_api_key)
            except ImportError:
                print("Anthropic library not installed. Install with: pip install anthropic")

    async def generate_questions(
        self,
        exam: str,
        topic: str,
        difficulty: str,
        count: int = 5
    ) -> List[GeneratedQuestion]:
        """
        Generate high-quality exam questions using AI

        Args:
            exam: Exam type (GRE, GMAT, LSAT, MCAT)
            topic: Topic for questions
            difficulty: Difficulty level (easy, medium, hard)
            count: Number of questions to generate

        Returns:
            List of generated questions with IRT parameters
        """
        prompt = self._build_question_generation_prompt(exam, topic, difficulty, count)

        # Try Anthropic Claude first (better for structured output)
        if self.anthropic_client:
            try:
                response = await self._generate_with_anthropic(prompt)
                return self._parse_generated_questions(response)
            except Exception as e:
                print(f"Anthropic generation failed: {e}")

        # Fallback to OpenAI
        if self.openai_client:
            try:
                response = await self._generate_with_openai(prompt)
                return self._parse_generated_questions(response)
            except Exception as e:
                print(f"OpenAI generation failed: {e}")

        # Fallback to template-based generation
        return self._generate_fallback_questions(exam, topic, difficulty, count)

    async def generate_explanation(
        self,
        request: ExplanationRequest
    ) -> Dict:
        """
        Generate personalized explanation for a question

        Args:
            request: Explanation request with question details

        Returns:
            Comprehensive explanation with insights
        """
        is_correct = request.user_answer == request.correct_answer

        prompt = f"""
Question: {request.question}

Choices:
{chr(10).join([f"{i+1}. {choice}" for i, choice in enumerate(request.choices)])}

Correct Answer: {request.choices[request.correct_answer]}
User's Answer: {request.choices[request.user_answer]}
Topic: {request.topic}

Please provide:
1. A clear explanation of why the correct answer is right
2. {"Great job! Explain why this answer demonstrates mastery" if is_correct else f"Why the user's answer ({request.choices[request.user_answer]}) is incorrect"}
3. Common mistakes students make on this type of question
4. Key concepts being tested
5. Study tips for mastering this topic

Format as JSON with keys: explanation, conceptsCovered, commonMistakes, relatedTopics, studyTips
"""

        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4-turbo-preview",
                    messages=[
                        {"role": "system", "content": "You are an expert tutor providing clear, helpful explanations."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.5,
                    response_format={"type": "json_object"}
                )

                return json.loads(response.choices[0].message.content)
            except Exception as e:
                print(f"Explanation generation failed: {e}")

        # Fallback explanation
        return {
            "explanation": f"The correct answer is {request.choices[request.correct_answer]}. " +
                          ("Excellent work!" if is_correct else "Review the concept and try again."),
            "conceptsCovered": [request.topic],
            "commonMistakes": ["Not reading carefully", "Rushing through"],
            "relatedTopics": [request.topic],
            "studyTips": [f"Practice more {request.topic} questions", "Review fundamentals"]
        }

    async def generate_study_plan(
        self,
        user_id: str,
        exam_date: str,
        target_score: int,
        current_score: int,
        weak_areas: List[str],
        available_hours: int
    ) -> Dict:
        """
        Generate personalized study plan using AI

        Args:
            user_id: User identifier
            exam_date: Target exam date
            target_score: Desired score
            current_score: Current score estimate
            weak_areas: Topics needing improvement
            available_hours: Hours available per week

        Returns:
            Detailed study plan with weekly breakdown
        """
        from datetime import datetime

        try:
            exam_date_obj = datetime.fromisoformat(exam_date)
            weeks_until = max(1, (exam_date_obj - datetime.now()).days // 7)
        except:
            weeks_until = 12  # Default to 12 weeks

        prompt = f"""
Create a personalized study plan:
- Weeks until exam: {weeks_until}
- Current score: {current_score}
- Target score: {target_score}
- Weak areas: {', '.join(weak_areas)}
- Available hours per week: {available_hours}

Generate a detailed weekly plan with:
1. Specific topics to focus on each week
2. Practice goals (questions per week)
3. Milestones to track progress
4. Resource recommendations

Format as JSON with: weeklyPlan, focusAreas, milestones, resources
"""

        if self.anthropic_client:
            try:
                response = self.anthropic_client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=2000,
                    messages=[{"role": "user", "content": prompt}]
                )

                return self._parse_study_plan(response.content[0].text)
            except Exception as e:
                print(f"Study plan generation failed: {e}")

        # Fallback plan
        return {
            "weeklyPlan": [
                {
                    "week": i + 1,
                    "focus": weak_areas[i % len(weak_areas)] if weak_areas else "General review",
                    "hours": available_hours,
                    "questions": available_hours * 20
                }
                for i in range(min(weeks_until, 12))
            ],
            "focusAreas": weak_areas,
            "milestones": [
                {"week": weeks_until // 4, "target": "25% improvement"},
                {"week": weeks_until // 2, "target": "50% improvement"},
                {"week": 3 * weeks_until // 4, "target": "75% improvement"}
            ],
            "resources": [
                {"type": "practice", "title": f"{area} Practice Questions", "duration": 120}
                for area in weak_areas
            ]
        }

    async def analyze_performance(
        self,
        responses: List[Dict]
    ) -> Dict:
        """
        Analyze response patterns for insights

        Args:
            responses: List of response records

        Returns:
            Performance analysis with recommendations
        """
        analysis = {
            "total_questions": len(responses),
            "correct": sum(1 for r in responses if r.get('is_correct', False)),
            "by_topic": self._group_by_topic(responses),
            "by_difficulty": self._group_by_difficulty(responses),
            "time_analysis": self._analyze_time_spent(responses)
        }

        # Calculate accuracy
        accuracy = analysis['correct'] / analysis['total_questions'] if analysis['total_questions'] > 0 else 0

        # Identify strengths and weaknesses
        strengths = []
        weaknesses = []

        for topic, stats in analysis['by_topic'].items():
            topic_accuracy = stats['correct'] / stats['total'] if stats['total'] > 0 else 0
            if topic_accuracy > 0.75:
                strengths.append(topic)
            elif topic_accuracy < 0.5:
                weaknesses.append(topic)

        # Generate recommendations
        recommendations = []

        if weaknesses:
            recommendations.append(
                f"Focus on improving: {', '.join(weaknesses[:3])}"
            )

        if analysis['time_analysis']['average'] > 120:  # 2 minutes per question
            recommendations.append(
                "Work on time management - you're spending too long per question"
            )

        if accuracy < 0.6:
            recommendations.append(
                "Review fundamental concepts before attempting harder questions"
            )

        # Predict score based on current performance
        predicted_score = self._predict_score_from_accuracy(accuracy)

        return {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations,
            "predicted_score": predicted_score,
            "confidence": min(0.9, accuracy + 0.1)  # Confidence based on accuracy
        }

    # Private helper methods

    def _build_question_generation_prompt(
        self,
        exam: str,
        topic: str,
        difficulty: str,
        count: int
    ) -> str:
        """Build prompt for question generation"""
        difficulty_guide = {
            'easy': 'Basic concepts, straightforward application, 70-90% success rate',
            'medium': 'Multi-step reasoning, concept integration, 40-70% success rate',
            'hard': 'Complex analysis, abstract reasoning, 10-40% success rate'
        }

        return f"""
Generate {count} high-quality {exam} questions on {topic}.
Difficulty: {difficulty} - {difficulty_guide.get(difficulty, 'medium')}

For each question provide:
1. Stem (clear, concise question)
2. 4-5 choices (plausible distractors)
3. Correct answer index (0-based)
4. Detailed explanation
5. IRT parameters:
   - a (discrimination): 0.5-2.0 (how well it differentiates abilities)
   - b (difficulty): -2 to 2 (negative = easier, positive = harder)
   - c (guessing): 0.2-0.25 (probability of random correct answer)
6. Cognitive level (Remember/Understand/Apply/Analyze/Evaluate/Create)

Format as JSON array with structure:
[{{"stem": "...", "choices": [...], "correctIndex": 0, "explanation": "...",
  "irtA": 1.0, "irtB": 0.0, "irtC": 0.25, "topics": [...], "cognitiveLevel": "Apply"}}]
"""

    async def _generate_with_anthropic(self, prompt: str) -> str:
        """Generate content using Anthropic Claude"""
        if not self.anthropic_client:
            raise Exception("Anthropic client not initialized")

        response = self.anthropic_client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=4000,
            temperature=0.7,
            system="You are an expert test prep content creator specializing in standardized exams.",
            messages=[{"role": "user", "content": prompt}]
        )

        return response.content[0].text

    async def _generate_with_openai(self, prompt: str) -> str:
        """Generate content using OpenAI GPT"""
        if not self.openai_client:
            raise Exception("OpenAI client not initialized")

        response = self.openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are an expert test prep content creator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        return response.choices[0].message.content

    def _generate_fallback_questions(
        self,
        exam: str,
        topic: str,
        difficulty: str,
        count: int
    ) -> List[GeneratedQuestion]:
        """Generate template-based fallback questions"""
        import random

        questions = []

        difficulty_params = {
            'easy': {'a': 0.8, 'b': -1.0, 'c': 0.25},
            'medium': {'a': 1.0, 'b': 0.0, 'c': 0.25},
            'hard': {'a': 1.2, 'b': 1.0, 'c': 0.25}
        }

        params = difficulty_params.get(difficulty, difficulty_params['medium'])

        for i in range(count):
            questions.append(GeneratedQuestion(
                stem=f"Sample {exam} question on {topic} (#{i + 1})",
                choices=[f"Option {chr(65 + j)}" for j in range(4)],
                correct_index=random.randint(0, 3),
                explanation="This is a sample explanation. AI generation requires API keys.",
                difficulty=difficulty,
                irt_params=params,
                topics=[topic],
                cognitive_level="Apply"
            ))

        return questions

    def _parse_generated_questions(self, content: str) -> List[GeneratedQuestion]:
        """Parse AI-generated questions from JSON"""
        try:
            data = json.loads(content)
            questions = []

            if isinstance(data, list):
                items = data
            elif isinstance(data, dict) and 'questions' in data:
                items = data['questions']
            else:
                return []

            for item in items:
                questions.append(GeneratedQuestion(
                    stem=item.get('stem', ''),
                    choices=item.get('choices', []),
                    correct_index=item.get('correctIndex', 0),
                    explanation=item.get('explanation', ''),
                    difficulty=item.get('difficulty', 'medium'),
                    irt_params={
                        'a': item.get('irtA', 1.0),
                        'b': item.get('irtB', 0.0),
                        'c': item.get('irtC', 0.25)
                    },
                    topics=item.get('topics', []),
                    cognitive_level=item.get('cognitiveLevel', 'Apply')
                ))

            return questions
        except Exception as e:
            print(f"Failed to parse questions: {e}")
            return []

    def _parse_study_plan(self, content: str) -> Dict:
        """Parse AI-generated study plan"""
        try:
            # Try to extract JSON from markdown code blocks
            if '```json' in content:
                json_start = content.find('```json') + 7
                json_end = content.find('```', json_start)
                content = content[json_start:json_end]
            elif '```' in content:
                json_start = content.find('```') + 3
                json_end = content.find('```', json_start)
                content = content[json_start:json_end]

            return json.loads(content)
        except:
            return {
                "weeklyPlan": [],
                "focusAreas": [],
                "milestones": [],
                "resources": []
            }

    def _group_by_topic(self, responses: List[Dict]) -> Dict:
        """Group responses by topic"""
        grouped = {}
        for r in responses:
            topic = r.get('topic', 'Unknown')
            if topic not in grouped:
                grouped[topic] = {'total': 0, 'correct': 0}
            grouped[topic]['total'] += 1
            if r.get('is_correct', False):
                grouped[topic]['correct'] += 1
        return grouped

    def _group_by_difficulty(self, responses: List[Dict]) -> Dict:
        """Group responses by difficulty"""
        grouped = {}
        for r in responses:
            difficulty = r.get('difficulty', 'medium')
            if difficulty not in grouped:
                grouped[difficulty] = {'total': 0, 'correct': 0}
            grouped[difficulty]['total'] += 1
            if r.get('is_correct', False):
                grouped[difficulty]['correct'] += 1
        return grouped

    def _analyze_time_spent(self, responses: List[Dict]) -> Dict:
        """Analyze time spent on questions"""
        times = [r.get('time_spent', 60) for r in responses]
        if not times:
            return {'average': 0, 'median': 0, 'fastest': 0, 'slowest': 0}

        times.sort()
        return {
            'average': sum(times) / len(times),
            'median': times[len(times) // 2],
            'fastest': min(times),
            'slowest': max(times)
        }

    def _predict_score_from_accuracy(self, accuracy: float) -> int:
        """Predict exam score from accuracy"""
        # Simple linear mapping (can be enhanced with ML model)
        # GRE scale: 130-170
        base_score = 130
        score_range = 40
        return int(base_score + accuracy * score_range)
