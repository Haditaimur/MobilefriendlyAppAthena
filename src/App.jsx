import { useState, useEffect } from 'react'

// Simple localStorage-based “DB”
const STORAGE_KEY = 'hotel-checkins'

function loadCheckIns() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Error reading check-ins from storage', e)
    return []
  }
}

function saveCheckIns(checkIns) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkIns))
  } catch (e) {
    console.error('Error saving check-ins to storage', e)
  }
}

export default function App() {
  const [checkIns, setCheckIns] = useState([])
  const [form, setForm] = useState({
    guestName: '',
    roomNumber: '',
    checkInDate: '',
    checkOutDate: '',
    notes: '',
  })

  // Load existing check-ins on first render (browser only)
  useEffect(() => {
    const existing = loadCheckIns()
    setCheckIns(existing)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newCheckIn = {
      id: Date.now(),
      ...form,
      createdAt: new Date().toISOString(),
    }

    const updated = [newCheckIn, ...checkIns]
    setCheckIns(updated)
    saveCheckIns(updated)

    // Reset form
    setForm({
      guestName: '',
      roomNumber: '',
      checkInDate: '',
      checkOutDate: '',
      notes: '',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 text-center">
            Hotel Check-in
          </h1>
          <p className="text-sm text-slate-600 text-center">
            Quick, mobile-friendly check-in form
          </p>
        </header>

        {/* Check-in form */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 mb-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            New Check-in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Guest Name *
              </label>
              <input
                type="text"
                name="guestName"
                required
                value={form.guestName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Room Number *
              </label>
              <input
                type="text"
                name="roomNumber"
                required
                value={form.roomNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 101, 205"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  name="checkInDate"
                  required
                  value={form.checkInDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={form.checkOutDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Special requests, car details, etc."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-lg mt-2 hover:bg-blue-700 active:scale-[0.99] transition"
            >
              Save Check-in
            </button>
          </form>
        </div>

        {/* Recent check-ins */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Recent Check-ins
          </h2>

          {checkIns.length === 0 ? (
            <p className="text-sm text-slate-500">
              No check-ins yet. Add your first one above.
            </p>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {checkIns.map((c) => (
                <div
                  key={c.id}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-slate-900">
                      {c.guestName}
                    </span>
                    <span className="text-xs text-slate-500">
                      Room {c.roomNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mb-1.5">
                    {c.checkInDate && (
                      <span>
                        In: {new Date(c.checkInDate).toLocaleDateString()}
                      </span>
                    )}
                    {c.checkOutDate && (
                      <span>
                        {'  '}· Out:{' '}
                        {new Date(c.checkOutDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {c.notes && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {c.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
