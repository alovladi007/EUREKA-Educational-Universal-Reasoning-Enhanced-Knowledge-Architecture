import axios from 'axios'

// Service URLs - Mapped to docker-compose external ports
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8009'
const TUTOR_URL = process.env.NEXT_PUBLIC_TUTOR_URL || 'http://localhost:8001'
const ASSESSMENT_URL = process.env.NEXT_PUBLIC_ASSESSMENT_URL || 'http://localhost:8002'
const ADAPTIVE_LEARNING_URL = process.env.NEXT_PUBLIC_ADAPTIVE_LEARNING_URL || 'http://localhost:8003'
const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL || 'http://localhost:8005'
const HS_TIER_URL = process.env.NEXT_PUBLIC_HS_TIER_URL || 'http://localhost:8010'

// Core API (Port 8009)
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// AI Tutor Service (Port 8001)
export const tutorApi = axios.create({
  baseURL: `${TUTOR_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Assessment Engine (Port 8002)
export const assessmentApi = axios.create({
  baseURL: `${ASSESSMENT_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Adaptive Learning (Port 8003)
export const adaptiveLearningApi = axios.create({
  baseURL: `${ADAPTIVE_LEARNING_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Analytics Dashboard (Port 8005)
export const analyticsApi = axios.create({
  baseURL: `${ANALYTICS_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// High School Tier (Port 8010)
export const hsTierApi = axios.create({
  baseURL: `${HS_TIER_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add auth token to all requests
const authRequestInterceptor = (config: any) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// Handle auth errors and token refresh
const authResponseInterceptor = async (error: any) => {
  const originalRequest = error.config

  // Handle 401 errors (unauthorized)
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      try {
        // Try to refresh the token
        const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
        const { access_token, refresh_token: new_refresh_token } = response.data

        localStorage.setItem('access_token', access_token)
        if (new_refresh_token) {
          localStorage.setItem('refresh_token', new_refresh_token)
        }

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    } else {
      // No refresh token, redirect to login
      localStorage.removeItem('access_token')
      window.location.href = '/auth/login'
    }
  }

  return Promise.reject(error)
}

// Apply interceptors to all API clients
const apiClients = [api, tutorApi, assessmentApi, adaptiveLearningApi, analyticsApi, hsTierApi]

apiClients.forEach(client => {
  client.interceptors.request.use(authRequestInterceptor, error => Promise.reject(error))
  client.interceptors.response.use(response => response, authResponseInterceptor)
})

export default api
