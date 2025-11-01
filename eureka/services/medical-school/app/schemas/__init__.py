"""
Pydantic schemas for Medical School service
"""

# Import from part1
from .part1 import (
    DifficultyLevel,
    CaseComplexity,
    DiagnosisConfidence,
    USMLEQuestionBase,
    USMLEQuestionCreate,
    USMLEQuestionUpdate,
    USMLEQuestionResponse,
    USMLEAttemptCreate,
    USMLEAttemptResponse,
    USMLEQuestionQuery,
    PatientDemographics,
    VitalSigns,
    ClinicalCaseBase,
    ClinicalCaseCreate,
    ClinicalCaseResponse,
    ClinicalCaseStudentView,
    CaseAttemptCreate,
    CaseAttemptResponse,
    CaseQuery,
    USMLEStatistics,
    ClinicalCaseStatistics,
    MedicalStudentDashboard,
)

# Import from part2
from .part2 import (
    RubricItem,
    OSCEStationBase,
    OSCEStationCreate,
    OSCEStationResponse,
    OSCEStationStudentView,
    OSCEAttemptCreate,
    OSCEAttemptResponse,
    OSCEExamSession,
    DiagnosticQuestion,
    DiagnosticTest,
    DiagnosticSessionCreate,
    DiagnosticSessionUpdate,
    DiagnosticSessionComplete,
    DiagnosticSessionResponse,
    DiagnosticFeedback,
    MedicalStudentProfileCreate,
    MedicalStudentProfileUpdate,
    MedicalStudentProfileResponse,
    MedicationBase,
    MedicationCreate,
    MedicationResponse,
    MedicationQuery,
    StudyRecommendation,
    PerformanceAlert,
    BatchQuestionImport,
    BatchImportResult,
)

__all__ = [
    # Enums
    "DifficultyLevel",
    "CaseComplexity",
    "DiagnosisConfidence",
    # USMLE
    "USMLEQuestionBase",
    "USMLEQuestionCreate",
    "USMLEQuestionUpdate",
    "USMLEQuestionResponse",
    "USMLEAttemptCreate",
    "USMLEAttemptResponse",
    "USMLEQuestionQuery",
    "USMLEStatistics",
    # Clinical Cases
    "PatientDemographics",
    "VitalSigns",
    "ClinicalCaseBase",
    "ClinicalCaseCreate",
    "ClinicalCaseResponse",
    "ClinicalCaseStudentView",
    "CaseAttemptCreate",
    "CaseAttemptResponse",
    "CaseQuery",
    "ClinicalCaseStatistics",
    # OSCE
    "RubricItem",
    "OSCEStationBase",
    "OSCEStationCreate",
    "OSCEStationResponse",
    "OSCEStationStudentView",
    "OSCEAttemptCreate",
    "OSCEAttemptResponse",
    "OSCEExamSession",
    # Diagnostic Reasoning
    "DiagnosticQuestion",
    "DiagnosticTest",
    "DiagnosticSessionCreate",
    "DiagnosticSessionUpdate",
    "DiagnosticSessionComplete",
    "DiagnosticSessionResponse",
    "DiagnosticFeedback",
    # Profile
    "MedicalStudentProfileCreate",
    "MedicalStudentProfileUpdate",
    "MedicalStudentProfileResponse",
    # Medications
    "MedicationBase",
    "MedicationCreate",
    "MedicationResponse",
    "MedicationQuery",
    # Recommendations
    "StudyRecommendation",
    "PerformanceAlert",
    # Dashboard
    "MedicalStudentDashboard",
    # Batch
    "BatchQuestionImport",
    "BatchImportResult",
]
