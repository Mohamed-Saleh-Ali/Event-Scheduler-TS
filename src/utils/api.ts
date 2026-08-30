// Shared fetch helper for the Events API (http://localhost:3001/api).
// Every request goes through here so pages never call `fetch` directly
// (see Definition of Done in PLANNING.md).

import type { DecodedToken, EventItem, PaginatedEvents } from '../types'

export const API_BASE_URL = 'http://localhost:3001/api'

function getToken(): string | null {
  return localStorage.getItem('e-api-token')
}

// Decodes the JWT payload without any extra dependency.
// Token shape (per events-api): { id, email, iat, exp }
export function decodeToken(token: string | null = getToken()): DecodedToken | null {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload)) as DecodedToken
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  const decoded = decodeToken()
  if (!decoded) return false
  // exp is in seconds, Date.now() in ms
  return decoded.exp * 1000 > Date.now()
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const headers: HeadersInit = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })

  // DELETE succeeds with 204 No Content
  if (res.status === 204) return null as T

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data as T
}

// ---------- Events ----------

export function getEvents({ page = 1, limit = 50 }: { page?: number; limit?: number } = {}) {
  return request<PaginatedEvents>(`/events?page=${page}&limit=${limit}`)
}

// GET /api/events/upcoming -> bare array, no pagination wrapper
export function getUpcomingEvents() {
  return request<EventItem[]>('/events/upcoming')
}

export function getEventById(id: string | number) {
  return request<EventItem>(`/events/${id}`)
}

// organizerId is set server-side from the token, so it's never part of the payload
export function createEvent(eventData: Omit<Partial<EventItem>, 'organizerId'>) {
  return request<EventItem>('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  })
}

export function updateEvent(id: string | number, eventData: Omit<Partial<EventItem>, 'organizerId'>) {
  return request<EventItem>(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  })
}

export function deleteEvent(id: string | number) {
  return request<null>(`/events/${id}`, { method: 'DELETE' })
}

// ---------- Auth (temporary stand-in until Bernd's AuthContext / SignIn page exist) ----------

interface SignUpPayload {
  name?: string
  email: string
  password: string
}

// POST /api/users -> creates a user. Note: no auto-login, redirect to /signin per PLANNING.md.
export function signUp({ name, email, password }: SignUpPayload) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: { id: number; email: string }
}

// POST /api/auth/login -> { token, user: { id, email } }
export function login({ email, password }: LoginPayload) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// GET /api/auth/profile -> requires Bearer token
export function getProfile() {
  return request('/auth/profile')
}
