"""
Utility functions for EUREKA Test Prep Platform
"""
import hashlib
import random
import string
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_random_string(length: int = 32) -> str:
    """Generate a random string of specified length"""
    letters = string.ascii_lowercase + string.digits
    return ''.join(random.choice(letters) for _ in range(length))


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    """Decode a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.JWTError:
        return None


def calculate_percentile(score: float, all_scores: list) -> float:
    """Calculate percentile rank of a score"""
    if not all_scores:
        return 0.0
    
    sorted_scores = sorted(all_scores)
    position = 0
    
    for s in sorted_scores:
        if s < score:
            position += 1
        else:
            break
    
    percentile = (position / len(sorted_scores)) * 100
    return round(percentile, 1)


def format_duration(seconds: int) -> str:
    """Format duration in seconds to human-readable string"""
    if seconds < 60:
        return f"{seconds}s"
    elif seconds < 3600:
        minutes = seconds // 60
        secs = seconds % 60
        return f"{minutes}m {secs}s"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        return f"{hours}h {minutes}m"


def calculate_accuracy_trend(attempts: list, window_size: int = 10) -> list:
    """Calculate moving average of accuracy over attempts"""
    if len(attempts) < window_size:
        window_size = len(attempts)
    
    if window_size == 0:
        return []
    
    trends = []
    for i in range(len(attempts) - window_size + 1):
        window = attempts[i:i + window_size]
        correct = sum(1 for a in window if a.is_correct)
        accuracy = (correct / window_size) * 100
        trends.append(accuracy)
    
    return trends


def generate_question_code(exam_type: str, subject: str, topic: str) -> str:
    """Generate a unique code for a question"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = generate_random_string(4)
    
    code_parts = [
        exam_type[:3].upper(),
        subject[:3].upper(),
        topic[:3].upper(),
        timestamp,
        random_suffix
    ]
    
    return "-".join(code_parts)


def calculate_difficulty_from_success_rate(success_rate: float) -> float:
    """
    Calculate IRT difficulty parameter from success rate
    Using inverse logit transformation
    """
    import math
    
    # Bound success rate to avoid division by zero
    success_rate = max(0.01, min(0.99, success_rate))
    
    # Inverse logit transformation
    difficulty = -math.log(success_rate / (1 - success_rate))
    
    # Bound to reasonable range
    return max(-3.0, min(3.0, difficulty))


def calculate_study_time_recommendation(
    current_ability: float,
    target_score: float,
    days_until_exam: int
) -> Dict[str, Any]:
    """
    Calculate recommended study time based on current ability and target
    """
    ability_gap = target_score - current_ability
    
    # Base hours needed per ability point improvement
    hours_per_point = 20
    
    total_hours_needed = max(10, ability_gap * hours_per_point)
    
    if days_until_exam > 0:
        hours_per_day = total_hours_needed / days_until_exam
        
        # Cap at reasonable daily limits
        if hours_per_day > 8:
            hours_per_day = 8
            achievable = False
            recommended_days = int(total_hours_needed / 8)
        else:
            achievable = True
            recommended_days = days_until_exam
    else:
        hours_per_day = 2
        achievable = False
        recommended_days = int(total_hours_needed / 2)
    
    return {
        "total_hours_needed": round(total_hours_needed, 1),
        "hours_per_day": round(hours_per_day, 1),
        "achievable": achievable,
        "recommended_days": recommended_days,
        "intensity": "high" if hours_per_day > 4 else "medium" if hours_per_day > 2 else "low"
    }


def validate_email(email: str) -> bool:
    """Validate email format"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def sanitize_html(text: str) -> str:
    """Remove HTML tags from text"""
    import re
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)


def paginate(query, page: int, per_page: int):
    """Paginate a SQLAlchemy query"""
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page
    }


def calculate_streak(dates: list) -> int:
    """Calculate consecutive days streak from a list of dates"""
    if not dates:
        return 0
    
    sorted_dates = sorted(dates, reverse=True)
    streak = 1
    current_date = sorted_dates[0].date() if hasattr(sorted_dates[0], 'date') else sorted_dates[0]
    
    for date in sorted_dates[1:]:
        date = date.date() if hasattr(date, 'date') else date
        if (current_date - date).days == 1:
            streak += 1
            current_date = date
        elif (current_date - date).days > 1:
            break
    
    return streak


def get_grade_from_percentage(percentage: float) -> str:
    """Convert percentage to letter grade"""
    if percentage >= 90:
        return "A"
    elif percentage >= 80:
        return "B"
    elif percentage >= 70:
        return "C"
    elif percentage >= 60:
        return "D"
    else:
        return "F"


def estimate_reading_time(text: str, words_per_minute: int = 200) -> int:
    """Estimate reading time in minutes"""
    word_count = len(text.split())
    minutes = word_count / words_per_minute
    return max(1, round(minutes))
