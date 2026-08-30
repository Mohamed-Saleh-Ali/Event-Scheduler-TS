import { useState } from 'react'
import { useNavigate } from 'react-router'
import { createEvent, isLoggedIn } from '../utils/api'

const initialForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  latitude: '',
  longitude: ''
}

export default function CreateEvent() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // TODO(after Bernd's AuthContext + ProtectedLayout merge): remove this
  // inline guard, this route will be wrapped by <ProtectedLayout /> instead.
  if (!isLoggedIn()) {
    return (
      <div className="container mx-auto p-4 max-w-lg">
        <div className="alert alert-warning">
          You need to be signed in to create an event. Sign-in page is on Bernd's branch —
          for now, log in via Swagger and run
          <code className="mx-1">localStorage.setItem(&apos;token&apos;, &apos;YOUR_TOKEN&apos;)</code>
          in the browser console.
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        title: form.title,
        description: form.description,
        // datetime-local gives "2026-08-20T18:00", API wants full ISO
        date: new Date(form.date).toISOString(),
        location: form.location,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined
      }

      const created = await createEvent(payload)
      navigate(`/events/${created.id}`)
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          rows={3}
        />
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="input input-bordered w-full"
          required
        />
        <div className="flex gap-3">
          <input
            name="latitude"
            type="number"
            step="any"
            value={form.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            className="input input-bordered w-full"
          />
          <input
            name="longitude"
            type="number"
            step="any"
            value={form.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create event'}
        </button>
      </form>
    </main>
  )
}
