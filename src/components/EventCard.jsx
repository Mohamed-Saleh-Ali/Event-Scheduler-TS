import { Link } from 'react-router'

export default function EventCard({ event }) {
  const formattedDate = new Date(event.date).toLocaleString('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  return (
    <Link
      to={`/events/${event.id}`}
      className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="card-body">
        <h2 className="card-title">{event.title}</h2>
        <p className="text-sm opacity-70">📅 {formattedDate}</p>
        <p className="text-sm opacity-70">📍 {event.location}</p>
      </div>
    </Link>
  )
}
