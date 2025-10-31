"""
EUREKA Medical School Service
Professional medical education platform
"""

__version__ = "1.0.0"

from .config import settings
from .database import Base, engine, get_db
from .models import *

__all__ = ["settings", "Base", "engine", "get_db"]
