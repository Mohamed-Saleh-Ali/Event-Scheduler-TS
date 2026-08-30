// Shared fetch helper for the Events API (http://localhost:3001/api).
// Every request goes through here so pages never call `fetch` directly
// (see Definition of Done in PLANNING.md).

export const API_BASE_URL = "http://localhost:3001/api";

function getToken() {
  return localStorage.getItem("e-api-token");
  console.log("getToken called, token:", localStorage.getItem("e-api-token"));
}

// Decodes the JWT payload without any extra dependency.
// Token shape (per events-api): { id, email, iat, exp }
export function decodeToken(token = getToken()) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function isLoggedIn() {
  const decoded = decodeToken()
  if (!decoded) return false
  // exp is in seconds, Date.now() in ms
  return decoded.exp * 1000 > Date.now()
}


async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  // DELETE succeeds with 204 No Content
  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

// ---------- Events ----------

// GET /api/events -> { totalCount, totalPages, currentPage, hasNextPage, hasPreviousPage, results: [...] }
export function getEvents({ page = 1, limit = 50 } = {}) {
  return request(`/events?page=${page}&limit=${limit}`);
}

// GET /api/events/upcoming -> bare array, no pagination wrapper
export function getUpcomingEvents() {
  return request("/events/upcoming");
}

// GET /api/events/:id -> single event object
export function getEventById(id) {
  return request(`/events/${id}`);
}

// POST /api/events -> requires Bearer token. organizerId is set server-side from the token.
export function createEvent(eventData) {
  return request("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

// PUT /api/events/:id -> requires Bearer token
export function updateEvent(id, eventData) {
  return request(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
}

// DELETE /api/events/:id -> requires Bearer token, 204 on success
export function deleteEvent(id) {
  return request(`/events/${id}`, { method: "DELETE" });
}

// ---------- Auth (temporary stand-in until Bernd's AuthContext / SignIn page exist) ----------

// POST /api/users -> creates a user. Note: no auto-login, redirect to /signin per PLANNING.md.
export function signUp({ name, email, password }) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// POST /api/auth/login -> { token, user: { id, email } }
export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// GET /api/auth/profile -> requires Bearer token
export function getProfile() {
  return request("/auth/profile");
}
