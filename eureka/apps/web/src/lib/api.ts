import axios from 'axios'

// Service URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const TUTOR_URL = process.env.NEXT_PUBLIC_TUTOR_URL || 'http://localhost:8050'
const ASSESSMENT_URL = process.env.NEXT_PUBLIC_ASSESSMENT_URL || 'http://localhost:8051'
const ADAPTIVE_LEARNING_URL = process.env.NEXT_PUBLIC_ADAPTIVE_LEARNING_URL || 'http://localhost:8052'
const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL || 'http://localhost:8053'
const HS_TIER_URL = process.env.NEXT_PUBLIC_HS_TIER_URL || 'http://localhost:8001'

// Core API (Port 8000)
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// AI Tutor Service (Port 8050)
export const tutorApi = axios.create({
  baseURL: `${TUTOR_URL}/api/v1/tutor`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Assessment Engine (Port 8051)
export const assessmentApi = axios.create({
  baseURL: `${ASSESSMENT_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Adaptive Learning (Port 8052)
export const adaptiveLearningApi = axios.create({
  baseURL: `${ADAPTIVE_LEARNING_URL}/api/v1/adaptive`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Analytics Dashboard (Port 8053)
export const analyticsApi = axios.create({
  baseURL: `${ANALYTICS_URL}/api/v1/analytics`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// High School Tier (Port 8001)
export const hsTierApi = axios.create({
  baseURL: `${HS_TIER_URL}/api/v1/hs`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // Redirect to login
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default api
