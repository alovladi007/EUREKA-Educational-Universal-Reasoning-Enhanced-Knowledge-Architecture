"""Resume import endpoints — PDF text extraction + AI parsing."""

import logging
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from app.core.config import settings
from app.utils.dependencies import get_current_active_user

logger = logging.getLogger(__name__)

# Router-level auth (Wave 1 security fix): PDF parsing burns CPU and the AI
# parse spends real Anthropic tokens — this was open to unauthenticated abuse.
router = APIRouter(
    prefix="/resumes/import",
    tags=["resume-import"],
    dependencies=[Depends(get_current_active_user)],
)


class ImportResponse(BaseModel):
    success: bool
    data: dict
    message: str


@router.post("/pdf", response_model=ImportResponse)
async def import_pdf(file: UploadFile = File(...)):
    """Extract text from a PDF resume and parse into structured ResumeData using AI."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        # Read PDF content
        content = await file.read()

        # Extract text using PyPDF2 (lightweight, no external deps)
        try:
            import PyPDF2
            import io
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        except ImportError:
            # Fallback: try pdfplumber
            try:
                import pdfplumber
                import io
                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            except ImportError:
                raise HTTPException(
                    status_code=503,
                    detail="PDF parsing requires PyPDF2 or pdfplumber. Install: pip install PyPDF2"
                )

        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. The file may be image-based (scanned).")

        # Use Claude AI to parse the extracted text into structured resume data
        if settings.ANTHROPIC_API_KEY:
            from anthropic import AsyncAnthropic
            client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

            prompt = f"""Parse this resume text into structured JSON data. Extract ALL information accurately.

RESUME TEXT:
{text[:5000]}

Return a JSON object with this EXACT structure:
{{
  "header": {{
    "firstName": "",
    "lastName": "",
    "headline": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "github": ""
  }},
  "summary": {{
    "content": ""
  }},
  "experience": [
    {{
      "title": "",
      "company": "",
      "location": "",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or null if current",
      "current": false,
      "bullets": [
        {{"content": "achievement text", "highlighted": false}}
      ]
    }}
  ],
  "education": [
    {{
      "institution": "",
      "degree": "",
      "field": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "gpa": "",
      "highlights": []
    }}
  ],
  "skills": {{
    "display": "grouped",
    "groups": [
      {{"label": "Category", "skills": ["skill1", "skill2"]}}
    ]
  }},
  "projects": [],
  "certifications": [],
  "languages": []
}}

Extract EVERY detail from the resume. Do not invent or fabricate information.
Return ONLY valid JSON, no markdown or explanation."""

            response = await client.messages.create(
                model=settings.AI_MODEL,
                max_tokens=4000,
                temperature=0.1,
                system="You are a resume parser that extracts structured data from resume text. Output only valid JSON.",
                messages=[{"role": "user", "content": prompt}],
            )

            import json
            import re
            result_text = response.content[0].text.strip()
            # Clean markdown code blocks
            if result_text.startswith("```"):
                result_text = re.sub(r"^```(?:json)?\s*\n?", "", result_text)
                result_text = re.sub(r"\n?```\s*$", "", result_text)

            parsed = json.loads(result_text)

            # Add IDs to items
            import uuid
            for exp in parsed.get("experience", []):
                exp["id"] = str(uuid.uuid4())[:8]
                for b in exp.get("bullets", []):
                    b["id"] = str(uuid.uuid4())[:8]
            for edu in parsed.get("education", []):
                edu["id"] = str(uuid.uuid4())[:8]
            for g in parsed.get("skills", {}).get("groups", []):
                g["id"] = str(uuid.uuid4())[:8]

            return ImportResponse(
                success=True,
                data=parsed,
                message=f"Successfully parsed {len(parsed.get('experience', []))} positions, {len(parsed.get('education', []))} education entries"
            )
        else:
            # No AI — return raw text for manual parsing
            return ImportResponse(
                success=True,
                data={"raw_text": text[:5000], "header": {"firstName": "", "lastName": ""}},
                message="PDF text extracted. AI parsing unavailable — configure ANTHROPIC_API_KEY for auto-parsing."
            )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF import error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")


@router.post("/text", response_model=ImportResponse)
async def import_text(text: str):
    """Parse pasted resume text into structured data using AI."""
    if not text.strip():
        raise HTTPException(status_code=400, detail="No text provided")

    # Same AI parsing as PDF but with direct text input
    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(status_code=503, detail="AI parsing requires ANTHROPIC_API_KEY")

    from anthropic import AsyncAnthropic
    client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

    prompt = f"""Parse this resume text into structured JSON. Extract all information.

{text[:5000]}

Return valid JSON with: header, summary, experience, education, skills, projects, certifications, languages."""

    response = await client.messages.create(
        model=settings.AI_MODEL,
        max_tokens=4000,
        temperature=0.1,
        system="You are a resume parser. Output only valid JSON.",
        messages=[{"role": "user", "content": prompt}],
    )

    import json, re
    result = response.content[0].text.strip()
    if result.startswith("```"):
        result = re.sub(r"^```(?:json)?\s*\n?", "", result)
        result = re.sub(r"\n?```\s*$", "", result)

    return ImportResponse(
        success=True,
        data=json.loads(result),
        message="Resume text parsed successfully"
    )
