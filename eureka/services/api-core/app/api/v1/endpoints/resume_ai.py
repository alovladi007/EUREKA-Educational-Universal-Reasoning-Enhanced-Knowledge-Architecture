"""Resume AI endpoints — summary generation, bullet improvement, ATS scoring."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/resumes/ai", tags=["resume-ai"])


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
    bullet: Optional[str] = None  # for improve
    title: Optional[str] = None
    company: Optional[str] = None
    context: Optional[str] = None


class BulletResponse(BaseModel):
    bullets: List[str]


class TailorRequest(BaseModel):
    resume_data: dict
    job_description: str


class TailorResponse(BaseModel):
    suggestions: List[dict]  # {section, original, suggested, reason}
    summary_rewrite: Optional[str] = None
    missing_keywords: List[str]


class SkillsRequest(BaseModel):
    title: str
    experience: Optional[list] = None
    education: Optional[list] = None


class SkillsResponse(BaseModel):
    suggested_skills: List[dict]  # {skill, category, relevance}


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
    issues: List[dict]  # {original, suggestion, reason}
    tone_score: int  # 0-100


# ── AI Endpoints ─────────────────────────────────────────────


@router.post("/generate-summary", response_model=SummaryResponse)
async def generate_summary(
    request: SummaryRequest,
    current_user=Depends(get_current_user),
):
    """Generate 3 professional summary variants using AI."""
    # TODO: Replace with actual Claude/GPT API call
    # System prompt: professional resume writer, 20+ years experience
    # Input: title, years, experience entries, target role
    # Output: 3 distinct summary variants, 2-4 sentences each

    title = request.title
    years = request.years
    target = request.target_role or title

    variants = [
        f"Results-driven {title} with {years}+ years of experience delivering high-impact solutions across diverse environments. Proven track record of leading cross-functional teams and driving measurable business outcomes. Passionate about leveraging deep technical expertise to excel as a {target}.",
        f"Dynamic {title} with {years} years of progressive experience building scalable systems and mentoring engineering teams. Expert in translating complex business requirements into elegant technical solutions. Seeking to bring a data-driven, impact-focused approach to a {target} role.",
        f"Accomplished {title} with {years}+ years spanning the full software development lifecycle. Demonstrated ability to architect robust systems, optimize performance by 40%+, and deliver products used by millions. Committed to engineering excellence and continuous improvement as a {target}.",
    ]

    return SummaryResponse(variants=variants)


@router.post("/generate-bullets", response_model=BulletResponse)
async def generate_bullets(
    request: BulletRequest,
    current_user=Depends(get_current_user),
):
    """Generate or improve resume bullet points using AI."""
    # TODO: Replace with actual Claude/GPT API call

    if request.action == "improve" and request.bullet:
        # Improve existing bullet with power verbs + metrics
        original = request.bullet
        improved = [
            original.replace("worked on", "Architected and delivered").replace("responsible for", "Led").replace("helped", "Drove") + " resulting in 25% improvement in key metrics",
            f"Spearheaded {original.lower().strip().rstrip('.')}, exceeding targets by 20% and reducing costs by $100K annually",
            f"Led initiative to {original.lower().strip().rstrip('.')}, leveraging best practices to achieve measurable impact across the organization",
        ]
        return BulletResponse(bullets=improved)
    else:
        # Generate new bullets from context
        company = request.company or "the organization"
        context = request.context or "engineering projects"
        bullets = [
            f"Led cross-functional initiative at {company} resulting in 30% improvement in key performance metrics and $500K+ in annual cost savings",
            f"Architected and deployed scalable {context} serving 100K+ users with 99.9% uptime and sub-200ms response times",
            f"Spearheaded adoption of modern engineering practices at {company}, reducing deployment time by 60% and increasing team velocity by 25%",
            f"Mentored 5+ junior team members through structured development programs, resulting in 3 promotions within 18 months",
            f"Designed and implemented automated testing framework achieving 95%+ code coverage, reducing production incidents by 40%",
        ]
        return BulletResponse(bullets=bullets)


@router.post("/tailor", response_model=TailorResponse)
async def tailor_resume(
    request: TailorRequest,
    current_user=Depends(get_current_user),
):
    """Tailor a resume to a specific job description using AI."""
    # TODO: Replace with actual Claude/GPT API call
    # Compare resume keywords vs JD keywords
    # Suggest rewrites for summary and bullets
    # Identify missing skills/keywords

    return TailorResponse(
        suggestions=[
            {
                "section": "summary",
                "original": "Current summary text",
                "suggested": "AI-tailored summary matching job description keywords",
                "reason": "Align summary with target role requirements",
            }
        ],
        summary_rewrite="Tailored summary will be generated by AI based on the job description.",
        missing_keywords=["keyword1", "keyword2", "keyword3"],
    )


@router.post("/suggest-skills", response_model=SkillsResponse)
async def suggest_skills(
    request: SkillsRequest,
    current_user=Depends(get_current_user),
):
    """Suggest relevant skills based on job title and experience."""
    # TODO: Replace with actual Claude/GPT API call

    title_lower = request.title.lower()
    skills = []

    if "software" in title_lower or "engineer" in title_lower or "developer" in title_lower:
        skills = [
            {"skill": "Python", "category": "Languages", "relevance": "high"},
            {"skill": "TypeScript", "category": "Languages", "relevance": "high"},
            {"skill": "React", "category": "Frameworks", "relevance": "high"},
            {"skill": "Node.js", "category": "Frameworks", "relevance": "high"},
            {"skill": "PostgreSQL", "category": "Databases", "relevance": "medium"},
            {"skill": "Docker", "category": "DevOps", "relevance": "medium"},
            {"skill": "AWS", "category": "Cloud", "relevance": "high"},
            {"skill": "Git", "category": "Tools", "relevance": "high"},
            {"skill": "CI/CD", "category": "DevOps", "relevance": "medium"},
            {"skill": "Agile/Scrum", "category": "Methodologies", "relevance": "medium"},
        ]
    else:
        skills = [
            {"skill": "Microsoft Office", "category": "Software", "relevance": "medium"},
            {"skill": "Data Analysis", "category": "Skills", "relevance": "high"},
            {"skill": "Project Management", "category": "Skills", "relevance": "high"},
            {"skill": "Communication", "category": "Soft Skills", "relevance": "high"},
            {"skill": "Leadership", "category": "Soft Skills", "relevance": "medium"},
        ]

    return SkillsResponse(suggested_skills=skills)


@router.post("/ats-score", response_model=ATSScoreResponse)
async def ats_score(
    request: ATSScoreRequest,
    current_user=Depends(get_current_user),
):
    """Analyze resume against ATS scoring criteria, optionally with a job description."""
    # TODO: Replace with actual Claude/GPT API call for JD-based analysis

    data = request.resume_data
    score = 0
    issues = []
    recommendations = []
    missing_keywords = []
    present_keywords = []

    # Section completeness (20%)
    header = data.get("header", {})
    has_summary = bool(data.get("summary", {}).get("content"))
    has_experience = len(data.get("experience", [])) > 0
    has_education = len(data.get("education", [])) > 0
    has_skills = any(len(g.get("skills", [])) > 0 for g in data.get("skills", {}).get("groups", []))
    has_contact = bool(header.get("email") and header.get("phone"))

    sections_present = sum([has_summary, has_experience, has_education, has_skills, has_contact])
    score += int((sections_present / 5) * 20)

    if not has_summary:
        recommendations.append({"title": "Add Professional Summary", "description": "A 2-4 sentence summary improves ATS parsing and recruiter engagement.", "impact": "high"})
    if not has_contact:
        issues.append({"issue": "Missing contact info", "severity": "high", "fix": "Add email and phone number"})

    # Bullet quality (20%)
    all_bullets = []
    for exp in data.get("experience", []):
        for b in exp.get("bullets", []):
            if b.get("content"):
                all_bullets.append(b["content"])

    avg_bullets = len(all_bullets) / max(len(data.get("experience", [])), 1)
    if avg_bullets >= 3:
        score += 20
    elif avg_bullets >= 2:
        score += 15
    elif avg_bullets >= 1:
        score += 10
    else:
        score += 5

    if avg_bullets < 3:
        recommendations.append({"title": "Add More Bullet Points", "description": f"Average {avg_bullets:.1f} bullets/role. Aim for 3-5.", "impact": "high"})

    # Quantified achievements (20%)
    import re
    quantified = sum(1 for b in all_bullets if re.search(r'\d+[%+]?|\$[\d,]+', b))
    q_ratio = quantified / max(len(all_bullets), 1)
    score += int(q_ratio * 20)

    if q_ratio < 0.5:
        recommendations.append({"title": "Add Metrics", "description": f"Only {int(q_ratio*100)}% of bullets have numbers. Add percentages, dollar amounts, counts.", "impact": "high"})

    # Action verbs (10%)
    action_verbs = ["led", "built", "designed", "managed", "created", "developed", "implemented", "improved", "increased", "reduced", "delivered", "launched", "spearheaded", "architected", "optimized", "automated", "mentored"]
    verbs_used = sum(1 for b in all_bullets if any(b.lower().startswith(v) for v in action_verbs))
    v_ratio = verbs_used / max(len(all_bullets), 1)
    score += int(v_ratio * 10)

    weak = [b for b in all_bullets if re.match(r'^(responsible for|worked on|helped|assisted)', b, re.I)]
    if weak:
        issues.append({"issue": f"{len(weak)} bullet(s) use weak verbs", "severity": "medium", "fix": "Replace with action verbs: Led, Built, Delivered"})

    # Skills count (15%)
    total_skills = sum(len(g.get("skills", [])) for g in data.get("skills", {}).get("groups", []))
    if total_skills >= 10:
        score += 15
    elif total_skills >= 5:
        score += 10
    elif total_skills > 0:
        score += 5

    if total_skills < 8:
        recommendations.append({"title": "Expand Skills", "description": f"{total_skills} skills listed. Aim for 10-15+.", "impact": "medium"})

    # Format (15%)
    score += 10  # Base for using our builder
    if header.get("firstName") and header.get("lastName"):
        score += 5
    else:
        issues.append({"issue": "Missing name", "severity": "high", "fix": "Add full name"})

    score = min(100, max(0, score))
    grade = "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "D" if score >= 60 else "F"
    summary_text = (
        "Your resume is well-optimized for ATS." if score >= 80
        else "Solid foundation with room for improvement." if score >= 60
        else "Significant improvements needed for ATS compatibility."
    )

    # JD keyword analysis (if provided)
    if request.job_description:
        jd_words = set(request.job_description.lower().split())
        resume_text = " ".join(all_bullets).lower()
        for word in jd_words:
            if len(word) > 4:  # Skip short words
                count = resume_text.count(word)
                if count > 0:
                    present_keywords.append({"keyword": word, "count": count})
                else:
                    missing_keywords.append({"keyword": word, "importance": "important", "suggestedSection": "skills"})

        # Limit to top keywords
        missing_keywords = sorted(missing_keywords, key=lambda x: len(x["keyword"]), reverse=True)[:10]
        present_keywords = sorted(present_keywords, key=lambda x: x["count"], reverse=True)[:10]

    return ATSScoreResponse(
        score=score,
        grade=grade,
        summary=summary_text,
        missing_keywords=missing_keywords,
        present_keywords=present_keywords,
        format_issues=issues,
        recommendations=recommendations,
    )


@router.post("/check-tone", response_model=ToneCheckResponse)
async def check_tone(
    request: ToneCheckRequest,
    current_user=Depends(get_current_user),
):
    """Analyze text for weak language and suggest improvements."""
    # TODO: Replace with actual Claude/GPT API call

    import re
    text = request.text
    issues = []
    weak_patterns = [
        (r'\bresponsible for\b', "Led", "Passive voice — use active action verb"),
        (r'\bworked on\b', "Built / Developed", "Vague — specify what you built or delivered"),
        (r'\bhelped\b', "Enabled / Facilitated", "Undermines your contribution — own the achievement"),
        (r'\bassisted\b', "Supported / Partnered with", "Minimizes your role"),
        (r'\binvolved in\b', "Contributed to / Drove", "Vague participation — show agency"),
        (r'\bvarious\b', "specific count (e.g., '5 projects')", "Vague — quantify instead"),
        (r'\bsuccessfully\b', "[remove — show success through results]", "Filler word — results speak louder"),
    ]

    for pattern, suggestion, reason in weak_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            issues.append({
                "original": matches[0],
                "suggestion": suggestion,
                "reason": reason,
            })

    tone_score = max(0, 100 - len(issues) * 15)

    return ToneCheckResponse(issues=issues, tone_score=tone_score)
