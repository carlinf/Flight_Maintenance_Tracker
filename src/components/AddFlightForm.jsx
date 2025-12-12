import { useState } from 'react'
import { addFlight } from '../firebase/services/flightsService'
import './AddFlightForm.css'

const AddFlightForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    flightNumber: '',
    aircraft: '',
    route: '',
    status: 'On Time',
    maintenanceStatus: 'Good',
    nextMaintenance: '',
    hours: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.flightNumber || !formData.aircraft || !formData.route) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Convert hours to number
      const flightData = {
        ...formData,
        hours: parseInt(formData.hours) || 0
      }

      await addFlight(flightData)
      
      // Reset form
      setFormData({
        flightNumber: '',
        aircraft: '',
        route: '',
        status: 'On Time',
        maintenanceStatus: 'Good',
        nextMaintenance: '',
        hours: ''
      })

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (err) {
      console.error('Error adding flight:', err)
      // Show more specific error message
      let errorMessage = 'Failed to add flight. Please try again.'
      if (err.message) {
        if (err.message.includes('permission') || err.message.includes('Permission')) {
          errorMessage = 'Permission denied. Please update Firestore security rules to allow writes. See FIRESTORE_RULES.md for instructions.'
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.'
        } else {
          errorMessage = `Error: ${err.message}`
        }
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Flight Record</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="flight-form">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                Please check:
                <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
                  <li>Firestore database is enabled in Firebase Console</li>
                  <li>Security rules allow write access</li>
                  <li>Check browser console for detailed error</li>
                </ul>
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="flightNumber">Flight Number *</label>
              <input
                type="text"
                id="flightNumber"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                placeholder="e.g., ET701"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="aircraft">Aircraft *</label>
              <select
                id="aircraft"
                name="aircraft"
                value={formData.aircraft}
                onChange={handleChange}
                required
              >
                <option value="">Select Aircraft</option>
                <option value="Boeing 737-800">Boeing 737-800</option>
                <option value="Boeing 787-8">Boeing 787-8</option>
                <option value="Boeing 777-300ER">Boeing 777-300ER</option>
                <option value="Airbus A350-900">Airbus A350-900</option>
                <option value="Bombardier Q400">Bombardier Q400</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="route">Route *</label>
              <input
                type="text"
                id="route"
                name="route"
                value={formData.route}
                onChange={handleChange}
                placeholder="e.g., ADD → DXB"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hours">Flight Hours</label>
              <input
                type="number"
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="On Time">On Time</option>
                <option value="Delayed">Delayed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maintenanceStatus">Maintenance Status</label>
              <select
                id="maintenanceStatus"
                name="maintenanceStatus"
                value={formData.maintenanceStatus}
                onChange={handleChange}
              >
                <option value="Good">Good</option>
                <option value="Due Soon">Due Soon</option>
                <option value="Maintenance Required">Maintenance Required</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nextMaintenance">Next Maintenance Date</label>
            <input
              type="date"
              id="nextMaintenance"
              name="nextMaintenance"
              value={formData.nextMaintenance}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Flight'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFlightForm

