/**
 * Centralized API Endpoints Configuration
 *
 * This file provides a single source of truth for all API endpoint URLs.
 * All URLs are derived from environment variables defined in .env.local
 *
 * Usage:
 *   import { API_ENDPOINTS } from '@/lib/api-endpoints';
 *   const response = await fetch(`${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/cases`);
 */

// Core Services
export const API_ENDPOINTS = {
  // Main API Core
  API_CORE: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',

  // Core Services
  TUTOR: process.env.NEXT_PUBLIC_TUTOR_URL || 'http://localhost:8001',
  ASSESS: process.env.NEXT_PUBLIC_ASSESS_URL || 'http://localhost:8002',
  ADAPTIVE: process.env.NEXT_PUBLIC_ADAPTIVE_URL || 'http://localhost:8003',
  CONTENT: process.env.NEXT_PUBLIC_CONTENT_URL || 'http://localhost:8004',
  ANALYTICS: process.env.NEXT_PUBLIC_ANALYTICS_URL || 'http://localhost:8005',

  // Tier Services
  TIER_HS: process.env.NEXT_PUBLIC_TIER_HS_URL || 'http://localhost:8010',
  TIER_UG: process.env.NEXT_PUBLIC_TIER_UG_URL || 'http://localhost:8011',
  TIER_GRAD: process.env.NEXT_PUBLIC_TIER_GRAD_URL || 'http://localhost:8012',

  // Professional Services
  // (PRO_MED removed — the pro-med service was retired and replaced by the
  //  medical-school service on :8030; MEDICAL_SCHOOL below is the live one.)
  PRO_LAW: process.env.NEXT_PUBLIC_PRO_LAW_URL || 'http://localhost:8021',
  PRO_MBA: process.env.NEXT_PUBLIC_PRO_MBA_URL || 'http://localhost:8022',
  PRO_ENG: process.env.NEXT_PUBLIC_PRO_ENG_URL || 'http://localhost:8023',

  // Phase 2 Advanced Services
  // medical-school runs on :8030 (NestJS). The old default :8020 was a dead
  // port, so the medical subpages (cases/OSCE/AI-tutor/content-studio/qbank
  // analytics) hit nothing whenever NEXT_PUBLIC_MEDICAL_SCHOOL_URL wasn't set.
  MEDICAL_SCHOOL: process.env.NEXT_PUBLIC_MEDICAL_SCHOOL_URL || 'http://localhost:8030',
  PEDAGOGY: process.env.NEXT_PUBLIC_PEDAGOGY_URL || 'http://localhost:8040',
  MARKETPLACE: process.env.NEXT_PUBLIC_MARKETPLACE_URL || 'http://localhost:8050',
  AI_RESEARCH: process.env.NEXT_PUBLIC_AI_RESEARCH_URL || 'http://localhost:8060',
  XR_LABS: process.env.NEXT_PUBLIC_XR_LABS_URL || 'http://localhost:8070',
  ETHICS_SECURITY: process.env.NEXT_PUBLIC_ETHICS_SECURITY_URL || 'http://localhost:8080',
  DATA_FABRIC: process.env.NEXT_PUBLIC_DATA_FABRIC_URL || 'http://localhost:8090',
  INSTITUTIONS: process.env.NEXT_PUBLIC_INSTITUTIONS_URL || 'http://localhost:8100',
  FUTURES: process.env.NEXT_PUBLIC_FUTURES_URL || 'http://localhost:8110',
  NOTEBOOK: process.env.NEXT_PUBLIC_NOTEBOOK_URL || 'http://localhost:8120',
  TEST_PREP: process.env.NEXT_PUBLIC_TEST_PREP_URL || 'http://localhost:8200',
} as const;

/**
 * Helper function to build full API URLs with paths
 *
 * @param service - The service key from API_ENDPOINTS
 * @param path - The API path (should start with /)
 * @returns Full URL string
 *
 * @example
 * buildApiUrl('MEDICAL_SCHOOL', '/api/v1/cases')
 * // Returns: 'http://localhost:8020/api/v1/cases'
 */
export function buildApiUrl(
  service: keyof typeof API_ENDPOINTS,
  path: string
): string {
  const baseUrl = API_ENDPOINTS[service];
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Common API endpoints for each service
 * Provides standardized endpoint patterns
 */
export const COMMON_PATHS = {
  HEALTH: '/health',
  API_V1: '/api/v1',
} as const;

/**
 * Medical School specific endpoints
 */
export const MEDICAL_ENDPOINTS = {
  BASE: API_ENDPOINTS.MEDICAL_SCHOOL,
  AI_TUTOR: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/ai-tutor`,
  CASES: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/cases`,
  OSCE: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/osce`,
  QBANK: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/qbank`,
  QBANK_ANALYTICS: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/qbank/analytics`,
  CONTENT: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/content`,
  CONTENT_SEARCH: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/content/search`,
  CONTENT_EXPORT: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/content/export`,
  ASSETS_UPLOAD: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/assets/upload`,
  WORKFLOW: `${API_ENDPOINTS.MEDICAL_SCHOOL}/content`,
  VERSIONS: `${API_ENDPOINTS.MEDICAL_SCHOOL}/api/v1/content`,
} as const;

/**
 * Test Prep specific endpoints
 */
export const TEST_PREP_ENDPOINTS = {
  BASE: API_ENDPOINTS.TEST_PREP,
  PLANS: `${API_ENDPOINTS.TEST_PREP}/api/v1/test-prep/plans`,
  SUBSCRIBE: `${API_ENDPOINTS.TEST_PREP}/api/v1/test-prep/subscribe`,
  SUBSCRIPTION: `${API_ENDPOINTS.TEST_PREP}/api/v1/test-prep/my-subscription`,
} as const;

/**
 * Notebook specific endpoints
 */
export const NOTEBOOK_ENDPOINTS = {
  BASE: API_ENDPOINTS.NOTEBOOK,
  FILES: `${API_ENDPOINTS.NOTEBOOK}/api/files`,
  DOWNLOAD: (fileId: string) => `${API_ENDPOINTS.NOTEBOOK}/api/files/${fileId}/download`,
} as const;
