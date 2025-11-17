"""
Question model matching the actual SQLite database schema
"""
from sqlalchemy import Column, String, Text, Integer, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Question(Base):
    """
    Question model matching actual database schema in questions.db

    Actual schema:
    - id TEXT PRIMARY KEY
    - exam TEXT NOT NULL
    - section TEXT NOT NULL
    - topic TEXT NOT NULL
    - subtopic TEXT
    - stem TEXT NOT NULL
    - choices TEXT
    - correct_index INTEGER
    - explanation TEXT
    - difficulty_label TEXT
    - irt_a REAL (discrimination parameter)
    - irt_b REAL (difficulty parameter)
    - irt_c REAL (guessing parameter)
    - time_seconds INTEGER
    - tags TEXT
    - created_at TIMESTAMP
    """
    __tablename__ = "questions"

    id = Column(String, primary_key=True)

    # Content (using actual column names from database)
    stem = Column(Text, nullable=False)  # The question text
    choices = Column(Text)  # JSON string of choices
    correct_index = Column(Integer)  # Index of correct answer in choices array
    explanation = Column(Text)  # Explanation of the answer

    # Categorization (using actual column names)
    exam = Column(String, nullable=False, index=True)  # GRE, GMAT, SAT, etc.
    section = Column(String, nullable=False, index=True)  # Verbal, Quant, etc.
    topic = Column(String, nullable=False, index=True)  # Algebra, Reading, etc.
    subtopic = Column(String)  # More specific topic
    tags = Column(String)  # Comma-separated tags

    # IRT Parameters (Item Response Theory) - using actual column names
    irt_a = Column(Float)  # Discrimination parameter
    irt_b = Column(Float, index=True)  # Difficulty parameter
    irt_c = Column(Float)  # Guessing parameter

    # Difficulty label
    difficulty_label = Column(String)  # easy, medium, hard

    # Time
    time_seconds = Column(Integer)  # Estimated time to answer

    # Metadata
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    attempts = relationship("QuestionAttempt", back_populates="question")

    # Compatibility properties for backend code expecting different names
    @property
    def question_text(self):
        """Alias for stem"""
        return self.stem

    @property
    def options(self):
        """Parse choices from JSON string"""
        if self.choices:
            import json
            try:
                return json.loads(self.choices)
            except:
                return []
        return []

    @property
    def correct_answer(self):
        """Return correct answer in expected format"""
        return {"correct_option": self.correct_index}

    @property
    def exam_type(self):
        """Alias for exam"""
        return self.exam

    @property
    def subject(self):
        """Alias for section"""
        return self.section

    @property
    def difficulty(self):
        """Alias for irt_b"""
        return self.irt_b or 0.0

    @property
    def discrimination(self):
        """Alias for irt_a"""
        return self.irt_a or 1.0

    @property
    def guessing(self):
        """Alias for irt_c"""
        return self.irt_c or 0.25

    @property
    def estimated_time_seconds(self):
        """Alias for time_seconds"""
        return self.time_seconds or 120

    @property
    def hint(self):
        """No hints in this database"""
        return None

    @property
    def image_url(self):
        """No images in this database"""
        return None

    @property
    def question_type(self):
        """All questions are multiple choice"""
        return "multiple_choice"
