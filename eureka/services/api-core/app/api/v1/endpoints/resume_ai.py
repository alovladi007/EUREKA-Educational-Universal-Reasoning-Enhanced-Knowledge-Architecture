"""Resume AI endpoints — real Claude API integration for resume writing assistance."""

import json
import re
import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth.dependencies import get_current_user
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/resumes/ai", tags=["resume-ai"])

# ── AI Client Setup ──────────────────────────────────────────

_anthropic_client = None


def get_ai_client():
    """Lazy-initialize the Anthropic client."""
    global _anthropic_client
    if _anthropic_client is None:
        if not settings.ANTHROPIC_API_KEY:
            raise HTTPException(
                status_code=503,
                detail="AI service not configured. Set ANTHROPIC_API_KEY in environment.",
            )
        try:
            from anthropic import AsyncAnthropic
            _anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        except ImportError:
            raise HTTPException(
                status_code=503,
                detail="anthropic package not installed. Run: pip install anthropic",
            )
    return _anthropic_client


SYSTEM_PROMPT = """You are a professional resume writer with 20+ years of experience helping candidates land jobs at top companies. You write concise, quantified, impact-driven resume content.

Rules:
- Always use strong action verbs (Led, Built, Designed, Optimized, etc.)
- Never use first-person pronouns (I, me, my)
- Quantify achievements wherever possible (percentages, dollar amounts, counts)
- Follow the XYZ format: "Accomplished [X] as measured by [Y], by doing [Z]"
- Keep bullet points to 1-2 lines max
- Focus on impact and results, not responsibilities
- Output MUST be valid JSON matching the specified schema exactly
- Never include markdown formatting, code blocks, or backticks in the JSON output"""


async def call_claude(prompt: str, system: str = SYSTEM_PROMPT, max_tokens: int = None) -> str:
    """Call Claude API and return the text response."""
    client = get_ai_client()
    try:
        response = await client.messages.create(
            model=settings.AI_MODEL,
            max_tokens=max_tokens or settings.AI_MAX_TOKENS,
            temperature=settings.AI_TEMPERATURE,
            system=system,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text
    except Exception as e:
        logger.error(f"Claude API error: {e}")
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")


def parse_json_response(text: str) -> dict:
    """Extract JSON from Claude's response, handling markdown code blocks."""
    # Try direct parse first
    text = text.strip()
    if text.startswith("```"):
        # Remove markdown code blocks
        text = re.sub(r"^```(?:json)?\s*\n?", "", text)
        text = re.sub(r"\n?```\s*$", "", text)
        text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON object/array in the text
        match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', text)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
        raise HTTPException(status_code=502, detail="AI returned invalid JSON response")


# ── Request/Response Schemas ─────────────────────────────────


class SummaryRequest(BaseModel):
    title: str
    years: str = "5"
    experience: Optional[list] = None
    target_role: Optional[str] = None


class SummaryResponse(BaseModel):
    variants: List[str]


class BulletRequest(BaseModel):
    action: str = "generate"  # "generate" | "improve"
    bullet: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    context: Optional[str] = None


class BulletResponse(BaseModel):
    bullets: List[str]


class TailorRequest(BaseModel):
    resume_data: dict
    job_description: str


class TailorResponse(BaseModel):
    summary_rewrite: Optional[str] = None
    bullet_suggestions: List[dict] = []
    missing_keywords: List[str] = []
    skill_gaps: List[str] = []
    overall_match_score: int = 0


class SkillsRequest(BaseModel):
    title: str
    experience: Optional[list] = None
    education: Optional[list] = None


class SkillsResponse(BaseModel):
    suggested_skills: List[dict]


class ATSScoreRequest(BaseModel):
    resume_data: dict
    job_description: Optional[str] = None


class ATSScoreResponse(BaseModel):
    score: int
    grade: str
    summary: str
    missing_keywords: List[dict]
    present_keywords: List[dict]
    format_issues: List[dict]
    recommendations: List[dict]


class ToneCheckRequest(BaseModel):
    text: str


class ToneCheckResponse(BaseModel):
    issues: List[dict]
    tone_score: int
    rewritten: Optional[str] = None


# ── AI Endpoints ─────────────────────────────────────────────


@router.post("/generate-summary", response_model=SummaryResponse)
async def generate_summary(
    request: SummaryRequest,
    current_user=Depends(get_current_user),
):
    """Generate 3 professional summary variants using Claude."""
    exp_context = ""
    if request.experience:
        exp_lines = []
        for exp in request.experience[:3]:  # Limit context
            if isinstance(exp, dict):
                exp_lines.append(f"- {exp.get('title', '')} at {exp.get('company', '')} ({exp.get('startDate', '')} - {exp.get('endDate', 'Present')})")
                for b in exp.get('bullets', [])[:3]:
                    if isinstance(b, dict) and b.get('content'):
                        exp_lines.append(f"  • {b['content']}")
                    elif isinstance(b, str) and b:
                        exp_lines.append(f"  • {b}")
        exp_context = f"\n\nRelevant experience:\n" + "\n".join(exp_lines)

    target = request.target_role or request.title

    prompt = f"""Generate exactly 3 professional resume summary variants for this person:

Job Title: {request.title}
Years of Experience: {request.years}
Target Role: {target}
{exp_context}

Requirements:
- Each summary should be 2-4 sentences
- Use third person (no "I" or "my")
- Include quantified achievements where possible
- Each variant should have a different tone: (1) results-driven, (2) leadership-focused, (3) innovation-focused
- Tailor to the target role

Return as JSON: {{"variants": ["summary1", "summary2", "summary3"]}}"""

    text = await call_claude(prompt)
    data = parse_json_response(text)
    return SummaryResponse(variants=data.get("variants", [text]))


@router.post("/generate-bullets", response_model=BulletResponse)
async def generate_bullets(
    request: BulletRequest,
    current_user=Depends(get_current_user),
):
    """Generate or improve resume bullet points using Claude."""

    if request.action == "improve" and request.bullet:
        prompt = f"""Improve this resume bullet point. Make it stronger with:
- A power verb at the start (Led, Built, Designed, Optimized, etc.)
- Quantified results (percentages, dollar amounts, counts)
- Clear impact statement
- XYZ format: "Accomplished [X] as measured by [Y], by doing [Z]"

Original bullet: "{request.bullet}"

Context (if available): {request.title or ''} at {request.company or ''}

Generate exactly 3 improved versions, each with a different emphasis (impact, scope, technical depth).

Return as JSON: {{"bullets": ["improved1", "improved2", "improved3"]}}"""

    else:
        company = request.company or "the organization"
        context = request.context or "various projects and initiatives"

        prompt = f"""Generate 5 strong resume bullet points for this role:

Job Title: {request.title or 'Professional'}
Company: {company}
Responsibilities/Context: {context}

Requirements for each bullet:
- Start with a strong action verb
- Include at least one quantified metric (%, $, count)
- Follow XYZ format: "Accomplished [X] as measured by [Y], by doing [Z]"
- Keep to 1-2 lines max
- Make each bullet cover a different achievement area (leadership, technical, process, collaboration, innovation)

Return as JSON: {{"bullets": ["bullet1", "bullet2", "bullet3", "bullet4", "bullet5"]}}"""

    text = await call_claude(prompt)
    data = parse_json_response(text)
    return BulletResponse(bullets=data.get("bullets", []))


@router.post("/tailor", response_model=TailorResponse)
async def tailor_resume(
    request: TailorRequest,
    current_user=Depends(get_current_user),
):
    """Tailor a resume to a specific job description using Claude."""
    resume = request.resume_data
    jd = request.job_description

    # Extract key resume text
    summary = resume.get("summary", {}).get("content", "")
    experience_text = ""
    for exp in resume.get("experience", [])[:3]:
        experience_text += f"\n{exp.get('title', '')} at {exp.get('company', '')}:\n"
        for b in exp.get("bullets", []):
            content = b.get("content", "") if isinstance(b, dict) else b
            if content:
                experience_text += f"- {content}\n"

    skills_text = ", ".join(
        skill
        for group in resume.get("skills", {}).get("groups", [])
        for skill in group.get("skills", [])
    )

    prompt = f"""Analyze this resume against the job description and provide tailoring suggestions.

CURRENT RESUME SUMMARY:
{summary}

CURRENT EXPERIENCE:
{experience_text}

CURRENT SKILLS: {skills_text}

JOB DESCRIPTION:
{jd}

Provide:
1. A rewritten summary tailored to this specific job (2-4 sentences)
2. 3-5 specific bullet point suggestions that better match the JD
3. Keywords from the JD that are missing from the resume
4. Skills mentioned in the JD but not in the resume
5. An overall match score (0-100)

Return as JSON:
{{
  "summary_rewrite": "tailored summary text",
  "bullet_suggestions": [
    {{"original": "existing bullet or empty", "suggested": "new/improved bullet", "reason": "why this change helps"}}
  ],
  "missing_keywords": ["keyword1", "keyword2"],
  "skill_gaps": ["skill1", "skill2"],
  "overall_match_score": 75
}}"""

    text = await call_claude(prompt, max_tokens=3000)
    data = parse_json_response(text)

    return TailorResponse(
        summary_rewrite=data.get("summary_rewrite"),
        bullet_suggestions=data.get("bullet_suggestions", []),
        missing_keywords=data.get("missing_keywords", []),
        skill_gaps=data.get("skill_gaps", []),
        overall_match_score=data.get("overall_match_score", 0),
    )


@router.post("/suggest-skills", response_model=SkillsResponse)
async def suggest_skills(
    request: SkillsRequest,
    current_user=Depends(get_current_user),
):
    """Suggest relevant skills based on job title and experience using Claude."""

    exp_context = ""
    if request.experience:
        for exp in request.experience[:3]:
            if isinstance(exp, dict):
                exp_context += f"- {exp.get('title', '')} at {exp.get('company', '')}\n"

    prompt = f"""Suggest 15 relevant skills for this professional profile:

Job Title: {request.title}
Experience:
{exp_context or 'Not provided'}

Categorize skills into groups. Include a mix of:
- Technical/hard skills (tools, languages, frameworks)
- Domain skills (industry-specific knowledge)
- Soft skills (leadership, communication)

Rate each skill's relevance as "high", "medium", or "low" based on the job title.

Return as JSON:
{{"suggested_skills": [
  {{"skill": "Python", "category": "Languages", "relevance": "high"}},
  {{"skill": "Leadership", "category": "Soft Skills", "relevance": "medium"}}
]}}"""

    text = await call_claude(prompt)
    data = parse_json_response(text)
    return SkillsResponse(suggested_skills=data.get("suggested_skills", []))


@router.post("/ats-score", response_model=ATSScoreResponse)
async def ats_score(
    request: ATSScoreRequest,
    current_user=Depends(get_current_user),
):
    """Full ATS analysis using Claude — optionally against a job description."""
    resume = request.resume_data

    # Build resume text representation
    header = resume.get("header", {})
    resume_text = f"""Name: {header.get('firstName', '')} {header.get('lastName', '')}
Title: {header.get('headline', '')}

Summary: {resume.get('summary', {}).get('content', '')}

Experience:
"""
    for exp in resume.get("experience", []):
        resume_text += f"\n{exp.get('title', '')} at {exp.get('company', '')} ({exp.get('startDate', '')} - {'Present' if exp.get('current') else exp.get('endDate', '')})\n"
        for b in exp.get("bullets", []):
            content = b.get("content", "") if isinstance(b, dict) else b
            if content:
                resume_text += f"  - {content}\n"

    resume_text += "\nEducation:\n"
    for edu in resume.get("education", []):
        resume_text += f"  {edu.get('degree', '')} in {edu.get('field', '')} from {edu.get('institution', '')}\n"

    resume_text += "\nSkills: "
    resume_text += ", ".join(
        skill
        for group in resume.get("skills", {}).get("groups", [])
        for skill in group.get("skills", [])
    )

    jd_section = ""
    if request.job_description:
        jd_section = f"""

JOB DESCRIPTION TO SCORE AGAINST:
{request.job_description}

When scoring, weight keyword overlap with the JD heavily (40% of score)."""

    prompt = f"""Perform a comprehensive ATS (Applicant Tracking System) compatibility analysis on this resume.

RESUME:
{resume_text}
{jd_section}

Score the resume on these criteria:
- Keyword relevance (40%): {"Match with job description keywords" if request.job_description else "Relevant industry keywords present"}
- Section completeness (20%): Has summary, experience, education, skills, contact info
- Quantified achievements (20%): Numbers, percentages, dollar amounts in bullets
- Format cleanliness (10%): No tables, clean text, proper structure
- Action verb usage (10%): Strong action verbs starting each bullet

Return as JSON:
{{
  "score": 85,
  "grade": "A",
  "summary": "Brief 1-2 sentence assessment",
  "missing_keywords": [
    {{"keyword": "kubernetes", "importance": "critical", "suggestedSection": "skills"}}
  ],
  "present_keywords": [
    {{"keyword": "python", "count": 3}}
  ],
  "format_issues": [
    {{"issue": "description of issue", "severity": "high", "fix": "how to fix"}}
  ],
  "recommendations": [
    {{"title": "Add more metrics", "description": "detailed suggestion", "impact": "high"}}
  ]
}}"""

    text = await call_claude(prompt, max_tokens=3000)
    data = parse_json_response(text)

    return ATSScoreResponse(
        score=data.get("score", 50),
        grade=data.get("grade", "C"),
        summary=data.get("summary", "Analysis complete"),
        missing_keywords=data.get("missing_keywords", []),
        present_keywords=data.get("present_keywords", []),
        format_issues=data.get("format_issues", []),
        recommendations=data.get("recommendations", []),
    )


@router.post("/check-tone", response_model=ToneCheckResponse)
async def check_tone(
    request: ToneCheckRequest,
    current_user=Depends(get_current_user),
):
    """Analyze resume text for weak language and suggest power verb replacements."""
    prompt = f"""Analyze this resume text for weak, vague, or passive language. Identify every instance of:
- Passive voice ("was responsible for", "was involved in")
- Weak verbs ("helped", "worked on", "assisted with", "participated in")
- Vague language ("various", "several", "many", "things")
- Filler words ("successfully", "effectively")
- First-person pronouns ("I", "my", "me")

Text to analyze:
"{request.text}"

For each issue, provide the original phrase, a stronger replacement, and why the change helps.
Also provide a rewritten version of the entire text with all improvements applied.
Score the tone from 0-100 (100 = perfect professional resume tone).

Return as JSON:
{{
  "issues": [
    {{"original": "was responsible for", "suggestion": "Led / Managed", "reason": "Passive voice — use active action verb"}}
  ],
  "tone_score": 65,
  "rewritten": "The full text rewritten with all improvements"
}}"""

    text = await call_claude(prompt)
    data = parse_json_response(text)

    return ToneCheckResponse(
        issues=data.get("issues", []),
        tone_score=data.get("tone_score", 50),
        rewritten=data.get("rewritten"),
    )
