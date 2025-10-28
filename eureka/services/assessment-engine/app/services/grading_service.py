"""
Grading Service for auto-grading with AI
"""
from typing import List, Tuple, Optional, Dict
import openai
from difflib import SequenceMatcher
import re

from app.core.config import settings
from app.core.models import Question, Answer, Rubric

class GradingService:
    """Service for grading student answers"""
    
    def __init__(self):
        self.openai_client = None
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
            self.openai_client = openai
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate similarity between two texts
        
        Args:
            text1: First text
            text2: Second text
            
        Returns:
            Similarity score between 0 and 1
        """
        # Normalize texts
        text1 = text1.lower().strip()
        text2 = text2.lower().strip()
        
        # Use SequenceMatcher for basic similarity
        return SequenceMatcher(None, text1, text2).ratio()
    
    def grade_multiple_choice(
        self,
        question: Question,
        student_answer: str
    ) -> Tuple[bool, float, str]:
        """
        Grade a multiple choice question
        
        Args:
            question: Question object
            student_answer: Student's selected option (e.g., "A")
            
        Returns:
            Tuple of (is_correct, points_earned, feedback)
        """
        is_correct = student_answer.upper() == question.correct_answer.upper()
        points_earned = question.points if is_correct else 0.0
        
        feedback = "Correct!" if is_correct else f"Incorrect. The correct answer is {question.correct_answer}."
        
        return is_correct, points_earned, feedback
    
    def grade_true_false(
        self,
        question: Question,
        student_answer: str
    ) -> Tuple[bool, float, str]:
        """Grade a true/false question"""
        # Normalize answers
        student_ans = student_answer.lower().strip()
        correct_ans = question.correct_answer.lower().strip()
        
        # Handle various true/false representations
        true_values = ["true", "t", "yes", "1"]
        false_values = ["false", "f", "no", "0"]
        
        if student_ans in true_values:
            student_ans = "true"
        elif student_ans in false_values:
            student_ans = "false"
        
        if correct_ans in true_values:
            correct_ans = "true"
        elif correct_ans in false_values:
            correct_ans = "false"
        
        is_correct = student_ans == correct_ans
        points_earned = question.points if is_correct else 0.0
        
        feedback = "Correct!" if is_correct else f"Incorrect. The statement is {correct_ans}."
        
        return is_correct, points_earned, feedback
    
    def check_keywords(
        self,
        student_answer: str,
        keywords: List[str]
    ) -> Tuple[float, List[str]]:
        """
        Check for presence of keywords in answer
        
        Args:
            student_answer: Student's answer
            keywords: List of keywords to check
            
        Returns:
            Tuple of (percentage_found, found_keywords)
        """
        answer_lower = student_answer.lower()
        found_keywords = []
        
        for keyword in keywords:
            if keyword.lower() in answer_lower:
                found_keywords.append(keyword)
        
        percentage = len(found_keywords) / len(keywords) if keywords else 0.0
        
        return percentage, found_keywords
    
    async def grade_short_answer(
        self,
        question: Question,
        student_answer: str
    ) -> Tuple[bool, float, str]:
        """
        Grade a short answer question
        
        Args:
            question: Question object
            student_answer: Student's answer
            
        Returns:
            Tuple of (is_correct, points_earned, feedback)
        """
        # Simple keyword-based grading
        if question.keywords:
            keyword_percentage, found_keywords = self.check_keywords(
                student_answer,
                question.keywords
            )
            
            # Award points proportionally to keywords found
            points_earned = question.points * keyword_percentage
            
            # Check similarity with answer key if available
            if question.answer_key:
                similarity = self.calculate_similarity(student_answer, question.answer_key)
                
                # If high similarity, award more points
                if similarity >= settings.SIMILARITY_THRESHOLD:
                    points_earned = question.points
            
            is_correct = points_earned >= (question.points * 0.7)  # 70% threshold
            
            feedback = f"Found {len(found_keywords)}/{len(question.keywords)} key points. "
            if is_correct:
                feedback += "Good answer!"
            else:
                missing = [k for k in question.keywords if k not in found_keywords]
                feedback += f"Consider including: {', '.join(missing[:3])}"
            
            return is_correct, points_earned, feedback
        
        # Use AI grading if available
        if self.openai_client and question.answer_key:
            return await self._grade_with_ai(question, student_answer)
        
        # Default: partial credit
        return True, question.points * 0.5, "Answer needs manual review."
    
    async def grade_essay(
        self,
        question: Question,
        student_answer: str,
        rubric: Optional[Rubric] = None
    ) -> Tuple[bool, float, str]:
        """
        Grade an essay question
        
        Args:
            question: Question object
            student_answer: Student's essay
            rubric: Optional rubric for structured grading
            
        Returns:
            Tuple of (is_correct, points_earned, feedback)
        """
        if not self.openai_client:
            return True, question.points * 0.5, "Essay needs manual review."
        
        # Use AI with rubric if available
        if rubric:
            return await self._grade_with_rubric(question, student_answer, rubric)
        else:
            return await self._grade_with_ai(question, student_answer)
    
    async def _grade_with_ai(
        self,
        question: Question,
        student_answer: str
    ) -> Tuple[bool, float, str]:
        """Grade using AI"""
        try:
            prompt = f"""You are an expert grader. Grade this student answer.

Question: {question.question_text}

Expected Answer/Key Points:
{question.answer_key or "Use your expertise to evaluate"}

Student Answer:
{student_answer}

Provide:
1. Score out of {question.points} points
2. Whether it's correct (Yes/No)
3. Constructive feedback (2-3 sentences)

Format your response as:
SCORE: X.X
CORRECT: Yes/No
FEEDBACK: Your feedback here"""

            response = await self.openai_client.chat.completions.create(
                model=settings.GRADING_MODEL,
                messages=[
                    {"role": "system", "content": "You are a fair and constructive grader."},
                    {"role": "user", "content": prompt}
                ],
                temperature=settings.GRADING_TEMPERATURE,
            )
            
            result = response.choices[0].message.content
            
            # Parse the response
            score_match = re.search(r'SCORE:\s*([\d.]+)', result)
            correct_match = re.search(r'CORRECT:\s*(Yes|No)', result, re.IGNORECASE)
            feedback_match = re.search(r'FEEDBACK:\s*(.+)', result, re.DOTALL)
            
            points_earned = float(score_match.group(1)) if score_match else question.points * 0.5
            is_correct = correct_match.group(1).lower() == "yes" if correct_match else False
            feedback = feedback_match.group(1).strip() if feedback_match else "See instructor feedback."
            
            return is_correct, points_earned, feedback
            
        except Exception as e:
            print(f"Error in AI grading: {e}")
            return True, question.points * 0.5, "Answer needs manual review."
    
    async def _grade_with_rubric(
        self,
        question: Question,
        student_answer: str,
        rubric: Rubric
    ) -> Tuple[bool, float, str]:
        """Grade using a rubric with AI"""
        try:
            criteria_text = "\n".join([
                f"- {c['name']} ({c['points']} points): {c['description']}"
                for c in rubric.criteria
            ])
            
            prompt = f"""Grade this essay using the rubric below.

Question: {question.question_text}

Student Answer:
{student_answer}

Rubric Criteria:
{criteria_text}

For each criterion, provide:
1. Points earned
2. Brief justification

Then provide overall feedback.

Format:
CRITERION: [name]
POINTS: X.X
JUSTIFICATION: ...

(repeat for each criterion)

OVERALL_FEEDBACK: ..."""

            response = await self.openai_client.chat.completions.create(
                model=settings.GRADING_MODEL,
                messages=[
                    {"role": "system", "content": "You are a fair grader using a rubric."},
                    {"role": "user", "content": prompt}
                ],
                temperature=settings.GRADING_TEMPERATURE,
            )
            
            result = response.choices[0].message.content
            
            # Parse rubric scores
            total_earned = 0.0
            for criterion in rubric.criteria:
                pattern = rf"CRITERION:\s*{re.escape(criterion['name'])}.*?POINTS:\s*([\d.]+)"
                match = re.search(pattern, result, re.DOTALL | re.IGNORECASE)
                if match:
                    total_earned += float(match.group(1))
            
            # Get overall feedback
            feedback_match = re.search(r'OVERALL_FEEDBACK:\s*(.+)', result, re.DOTALL)
            feedback = feedback_match.group(1).strip() if feedback_match else "See detailed rubric scores."
            
            is_correct = total_earned >= (question.points * 0.7)
            
            return is_correct, total_earned, feedback
            
        except Exception as e:
            print(f"Error in rubric grading: {e}")
            return True, question.points * 0.5, "Answer needs manual review."
    
    def calculate_grade_letter(self, percentage: float) -> str:
        """Convert percentage to letter grade"""
        if percentage >= 93:
            return "A"
        elif percentage >= 90:
            return "A-"
        elif percentage >= 87:
            return "B+"
        elif percentage >= 83:
            return "B"
        elif percentage >= 80:
            return "B-"
        elif percentage >= 77:
            return "C+"
        elif percentage >= 73:
            return "C"
        elif percentage >= 70:
            return "C-"
        elif percentage >= 67:
            return "D+"
        elif percentage >= 63:
            return "D"
        elif percentage >= 60:
            return "D-"
        else:
            return "F"
    
    def generate_overall_feedback(
        self,
        percentage: float,
        strong_areas: List[str],
        weak_areas: List[str]
    ) -> str:
        """Generate overall feedback for submission"""
        feedback_parts = []
        
        # Performance summary
        if percentage >= 90:
            feedback_parts.append("Excellent work!")
        elif percentage >= 80:
            feedback_parts.append("Great job!")
        elif percentage >= 70:
            feedback_parts.append("Good effort.")
        elif percentage >= 60:
            feedback_parts.append("Satisfactory performance.")
        else:
            feedback_parts.append("Needs improvement.")
        
        # Strong areas
        if strong_areas:
            feedback_parts.append(f"Strengths: {', '.join(strong_areas[:3])}.")
        
        # Areas for improvement
        if weak_areas:
            feedback_parts.append(f"Areas to review: {', '.join(weak_areas[:3])}.")
        
        return " ".join(feedback_parts)

# Singleton instance
grading_service = GradingService()
