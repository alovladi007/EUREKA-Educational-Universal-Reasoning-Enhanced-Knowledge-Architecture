"""
Analytics Dashboard Service - Main Application

Port: 8005
Purpose: Comprehensive analytics, metrics, and insights for students and courses
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.v1 import router as api_router
from app.core.config import get_settings
from app.core.database import engine

settings = get_settings()

# P2-8 session: this service has no alembic (its tables predate the models and
# came from ops SQL with a much thinner shape — every table was missing model
# columns, which 500ed the routes). Converge additively and idempotently on
# startup: create missing tables, then ALTER-add any ORM column the live table
# lacks, using the ORM column's compiled Postgres type. Never drops or narrows.
async def _converge_schema() -> None:
    from sqlalchemy.dialects import postgresql

    from app.core.models import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        for table in Base.metadata.sorted_tables:
            res = await conn.execute(text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name = :t"), {"t": table.name})
            existing = {r[0] for r in res}
            if not existing:
                continue
            for col in table.columns:
                if col.name in existing:
                    continue
                # Enum columns: make sure the PG type exists before the ALTER
                # (create_all only creates types alongside brand-new tables).
                if hasattr(col.type, "create"):
                    await conn.run_sync(
                        lambda sc, t=col.type: t.create(sc, checkfirst=True))
                ddl = (f'ALTER TABLE {table.name} ADD COLUMN IF NOT EXISTS '
                       f'"{col.name}" {col.type.compile(postgresql.dialect())}')
                default = getattr(col.default, "arg", None)
                if isinstance(default, bool):
                    ddl += f" DEFAULT {'TRUE' if default else 'FALSE'}"
                elif isinstance(default, (int, float)):
                    ddl += f" DEFAULT {default}"
                await conn.execute(text(ddl))
            # Reverse drift: legacy DB columns the ORM never populates but the
            # ops SQL made NOT NULL (metric_name, timeframe, alert_type, ...)
            # reject every ORM insert. Relax them — nothing in this service
            # writes or reads those columns.
            orm_cols = {c.name for c in table.columns}
            res = await conn.execute(text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name = :t AND is_nullable = 'NO' "
                "AND column_default IS NULL"), {"t": table.name})
            for (legacy,) in res:
                if legacy not in orm_cols:
                    await conn.execute(text(
                        f'ALTER TABLE {table.name} ALTER COLUMN "{legacy}" DROP NOT NULL'))
        for t in ("student_analytics", "student_outcome_achievements",
                  "at_risk_alerts", "engagement_events", "performance_trends"):
            await conn.execute(text(
                f"CREATE INDEX IF NOT EXISTS ix_{t}_org_id ON {t} (org_id)"))
        # The legacy engagement_events.event_type is a PG enum; the ORM binds
        # varchar and every insert fails with DatatypeMismatch. Widen to the
        # ORM's type (lossless: enum labels become plain text).
        await conn.execute(text(
            "DO $$ BEGIN "
            "IF EXISTS (SELECT 1 FROM information_schema.columns "
            "WHERE table_name='engagement_events' AND column_name='event_type' "
            "AND data_type='USER-DEFINED') THEN "
            "ALTER TABLE engagement_events ALTER COLUMN event_type "
            "TYPE VARCHAR(100) USING event_type::text; "
            "END IF; END $$"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    await _converge_schema()
    yield


# Create FastAPI app
app = FastAPI(
    title="EUREKA Analytics Dashboard Service",
    description="Comprehensive analytics and insights for learning outcomes",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1/analytics", tags=["analytics"])


@app.get("/")
async def root():
    """Service information"""
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.VERSION,
        "status": "running",
        "features": [
            "Student analytics",
            "Course analytics",
            "At-risk student identification",
            "Engagement tracking",
            "Performance metrics",
            "Learning outcome tracking",
            "Cohort analysis",
            "Dashboard summaries"
        ]
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.SERVICE_NAME}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )
