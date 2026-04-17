"""Resume export endpoints — PDF, DOCX, JSON generation."""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/exports", tags=["resume-exports"])


class PDFExportRequest(BaseModel):
    resume_id: str
    template_id: str = "meridian"
    paper_size: str = "letter"  # "letter" | "a4"


class PDFExportResponse(BaseModel):
    job_id: str
    status: str = "queued"
    message: str = "PDF generation has been queued"


class ExportStatusResponse(BaseModel):
    job_id: str
    status: str  # "queued" | "processing" | "completed" | "failed"
    file_url: Optional[str] = None
    error: Optional[str] = None


class DOCXExportRequest(BaseModel):
    resume_data: dict
    template_id: str = "meridian"


class TemplateInfo(BaseModel):
    id: str
    name: str
    description: str
    best_for: str
    preview_url: Optional[str] = None


# ── PDF Export ───────────────────────────────────────────────


@router.post("/pdf", response_model=PDFExportResponse)
async def export_pdf(
    request: PDFExportRequest,
    current_user=Depends(get_current_user),
):
    """Queue a PDF export job. Returns a job ID for polling."""
    # TODO: Implement with BullMQ + Puppeteer worker
    # 1. Fetch resume data from database
    # 2. Enqueue job to BullMQ queue
    # 3. Worker renders HTML template with Puppeteer
    # 4. Save PDF to S3, update job status
    # 5. Return signed S3 URL

    import uuid
    job_id = str(uuid.uuid4())

    return PDFExportResponse(
        job_id=job_id,
        status="queued",
        message="PDF generation queued. Poll /exports/status/{job_id} for completion.",
    )


@router.get("/status/{job_id}", response_model=ExportStatusResponse)
async def export_status(
    job_id: str,
    current_user=Depends(get_current_user),
):
    """Poll the status of a PDF export job."""
    # TODO: Check BullMQ job status
    # Return file_url when completed

    return ExportStatusResponse(
        job_id=job_id,
        status="completed",
        file_url=f"/api/v1/exports/download/{job_id}",
    )


# ── DOCX Export ──────────────────────────────────────────────


@router.post("/docx")
async def export_docx(
    request: DOCXExportRequest,
    current_user=Depends(get_current_user),
):
    """Generate and return a DOCX file from resume data."""
    # TODO: Use python-docx library to generate Word document
    # Map resume data to Word document structure
    # Return as file download

    return JSONResponse(
        content={"message": "DOCX export endpoint ready. python-docx integration pending."},
        status_code=200,
    )


# ── JSON Export ──────────────────────────────────────────────


@router.get("/json/{resume_id}")
async def export_json(
    resume_id: str,
    current_user=Depends(get_current_user),
):
    """Download resume data as JSON."""
    # TODO: Fetch from database and return as JSON file
    from app.core.database import get_db
    from app.crud.resume import get_resume
    from sqlalchemy.orm import Session

    # For now return placeholder
    return JSONResponse(
        content={"message": "JSON export endpoint ready. Database integration pending."},
        status_code=200,
    )


# ── Templates ────────────────────────────────────────────────


TEMPLATES = [
    TemplateInfo(id="meridian", name="Meridian", description="Clean, single-column with bold headers", best_for="Tech / Engineering"),
    TemplateInfo(id="atlas", name="Atlas", description="Two-column with sidebar for skills and contact", best_for="Business / Finance"),
    TemplateInfo(id="prism", name="Prism", description="Colorful header band with modern typography", best_for="Design / Marketing"),
    TemplateInfo(id="scholar", name="Scholar", description="Academic, dense, publications-ready", best_for="Academia / Research"),
    TemplateInfo(id="carta", name="Carta", description="Minimalist with generous whitespace", best_for="Executives / Senior"),
    TemplateInfo(id="vertex", name="Vertex", description="Technical grid layout with clear hierarchy", best_for="Engineers / PMs"),
    TemplateInfo(id="foundry", name="Foundry", description="Dark header, bold typography", best_for="Creative / Startups"),
    TemplateInfo(id="pulse", name="Pulse", description="Timeline-based with visual progression", best_for="UX / Product"),
]


@router.get("/templates", response_model=list[TemplateInfo])
async def list_templates():
    """List all available resume templates."""
    return TEMPLATES


@router.get("/templates/{template_id}", response_model=TemplateInfo)
async def get_template(template_id: str):
    """Get metadata for a specific template."""
    template = next((t for t in TEMPLATES if t.id == template_id), None)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template
