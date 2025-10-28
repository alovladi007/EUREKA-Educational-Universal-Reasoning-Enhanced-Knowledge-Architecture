#!/usr/bin/env python3
"""
Create Database Tables for AI Tutor Service
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.models import Base
from app.core.config import get_settings

async def create_tables():
    """Create all database tables"""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, echo=True)

    print("Creating all tables for AI Tutor service...")

    async with engine.begin() as conn:
        # Drop all tables (if you want to start fresh)
        # await conn.run_sync(Base.metadata.drop_all)

        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

    print("✅ All tables created successfully!")

    # List created tables
    print("\nCreated tables:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")

if __name__ == "__main__":
    asyncio.run(create_tables())
