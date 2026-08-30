import { useEffect, useState } from 'react'
import EventCard from '../components/EventCard'
import { getEvents } from '../utils/api'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function loadEvents() {
      setLoading(true)
      setError(null)

      try {
        const data = await getEvents({ page: 1, limit: 50 })
        if (!ignore) setEvents(data.results)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadEvents()

    return () => {
      ignore = true
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-error m-4">{error}</div>
  }

  if (events.length === 0) {
    return <p className="text-center p-10 opacity-70">No events yet.</p>
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  )
}
