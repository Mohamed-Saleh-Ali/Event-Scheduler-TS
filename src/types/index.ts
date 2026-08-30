// Shared types for the Events API + app state.
// Keep these lined up with the actual API responses - see Planing/PLANNING.md.

export interface EventItem {
  id: number
  title: string
  description: string
  date: string // ISO string
  location: string
  latitude?: number
  longitude?: number
  organizerId: number
  createdAt?: string
  updatedAt?: string
}

// GET /api/events -> paginated wrapper, events live in .results
export interface PaginatedEvents {
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  results: EventItem[]
}

// JWT payload (events-api): { id, email, iat, exp }
export interface DecodedToken {
  id: number
  email: string
  iat: number
  exp: number
}

export type ApiErrorKind =
  | 'network'
  | 'technical'
  | 'unauthorized'
  | 'validation'
  | 'conflict'
  | 'unknown'

export interface ApiError {
  kind: ApiErrorKind
  status?: number
  message: string
}

// Fetches.ts throws plain objects shaped like ApiError instead of Error
// instances, so callers need a real check before reading err.kind.
export function isApiError(err: unknown): err is ApiError {
  return typeof err === 'object' && err !== null && 'kind' in err && 'message' in err
}
