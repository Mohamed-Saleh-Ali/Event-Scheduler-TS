import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { decodeToken, deleteEvent, getEventById } from '../utils/api'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadEvent() {
      setLoading(true)
      setError(null)

      try {
        const data = await getEventById(id)
        if (!ignore) setEvent(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadEvent()

    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="link link-hover mt-4 inline-block">
          ← Back to all events
        </Link>
      </div>
    )
  }

  if (!event) return null

  // Only the organizer who created the event sees the delete button.
  // The API also enforces this server-side (403/404 if not the owner).
  const currentUser = decodeToken()
  const isOwner = currentUser?.id === event.organizerId

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${event.title}"? This can't be undone.`)
    if (!confirmed) return

    setDeleting(true)
    setError(null)

    try {
      await deleteEvent(id)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <Link to="/" className="link link-hover mb-4 inline-block">
        ← Back to all events
      </Link>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h1 className="card-title text-2xl">{event.title}</h1>
          <p className="opacity-70">
            📅{' '}
            {new Date(event.date).toLocaleString('de-DE', {
              dateStyle: 'full',
              timeStyle: 'short'
            })}
            {' · '}📍 {event.location}
          </p>

          {event.description && <p className="mt-4">{event.description}</p>}

          {event.latitude && event.longitude && (
            <a
              className="link link-primary mt-2 inline-block"
              target="_blank"
              rel="noreferrer"
              href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
            >
              View on map ↗
            </a>
          )}

          {isOwner && (
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-error" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete event'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
