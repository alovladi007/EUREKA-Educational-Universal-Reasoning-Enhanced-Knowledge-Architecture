"""
Authentication utilities

Password hashing, JWT token generation/validation, and email verification.
"""

from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import secrets
import hashlib

from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(
    schemes=settings.PWD_CONTEXT_SCHEMES,
    deprecated=settings.PWD_CONTEXT_DEPRECATED
)


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Payload data to encode in token
        expires_delta: Optional expiration time delta
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


def create_refresh_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT refresh token.
    
    Args:
        data: Payload data to encode in token
        expires_delta: Optional expiration time delta
        
    Returns:
        Encoded JWT refresh token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRATION_DAYS)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT token.
    
    Args:
        token: JWT token to decode
        
    Returns:
        Decoded token payload
        
    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise JWTError(f"Invalid token: {str(e)}")


def verify_token(token: str, token_type: str = "access") -> Dict[str, Any]:
    """
    Verify a JWT token and check its type.
    
    Args:
        token: JWT token to verify
        token_type: Expected token type ('access' or 'refresh')
        
    Returns:
        Decoded token payload
        
    Raises:
        JWTError: If token is invalid, expired, or wrong type
    """
    payload = decode_token(token)
    
    if payload.get("type") != token_type:
        raise JWTError(f"Invalid token type. Expected {token_type}")
    
    return payload


def create_email_verification_token(user_id: str, email: str) -> str:
    """
    Create a token for email verification.
    
    Args:
        user_id: User ID
        email: Email address to verify
        
    Returns:
        Verification token
    """
    data = {
        "sub": user_id,
        "email": email,
        "type": "email_verification"
    }
    
    # Email verification tokens expire in 24 hours
    expires_delta = timedelta(hours=24)
    
    return create_access_token(data, expires_delta)


def verify_email_token(token: str) -> Dict[str, Any]:
    """
    Verify an email verification token.
    
    Args:
        token: Email verification token
        
    Returns:
        Token payload with user_id and email
        
    Raises:
        JWTError: If token is invalid or expired
    """
    payload = decode_token(token)
    
    if payload.get("type") != "email_verification":
        raise JWTError("Invalid token type")
    
    return payload


def create_password_reset_token(user_id: str, email: str) -> str:
    """
    Create a token for password reset.
    
    Args:
        user_id: User ID
        email: User email
        
    Returns:
        Password reset token
    """
    data = {
        "sub": user_id,
        "email": email,
        "type": "password_reset"
    }
    
    # Password reset tokens expire in 1 hour
    expires_delta = timedelta(hours=1)
    
    return create_access_token(data, expires_delta)


def verify_password_reset_token(token: str) -> Dict[str, Any]:
    """
    Verify a password reset token.
    
    Args:
        token: Password reset token
        
    Returns:
        Token payload with user_id and email
        
    Raises:
        JWTError: If token is invalid or expired
    """
    payload = decode_token(token)
    
    if payload.get("type") != "password_reset":
        raise JWTError("Invalid token type")
    
    return payload


def generate_random_token(length: int = 32) -> str:
    """
    Generate a random token for various purposes.
    
    Args:
        length: Length of the token in bytes
        
    Returns:
        Random token as hex string
    """
    return secrets.token_hex(length)


def hash_token(token: str) -> str:
    """
    Hash a token for secure storage.
    
    Args:
        token: Token to hash
        
    Returns:
        SHA256 hash of the token
    """
    return hashlib.sha256(token.encode()).hexdigest()
