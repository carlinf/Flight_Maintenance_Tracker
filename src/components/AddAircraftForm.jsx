import { useState } from 'react'
import { addAircraft } from '../firebase/services/aircraftService'
import './AddAircraftForm.css'

const AddAircraftForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    tailNumber: '',
    model: '',
    status: 'Available',
    location: '',
    flightHours: '',
    lastMaintenance: '',
    nextMaintenance: '',
    healthScore: 100
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'flightHours' || name === 'healthScore' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.tailNumber || !formData.model || !formData.location) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      await addAircraft({
        ...formData,
        flightHours: parseInt(formData.flightHours) || 0,
        healthScore: parseInt(formData.healthScore) || 100
      })
      
      // Reset form
      setFormData({
        tailNumber: '',
        model: '',
        status: 'Available',
        location: '',
        flightHours: '',
        lastMaintenance: '',
        nextMaintenance: '',
        healthScore: 100
      })

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (err) {
      console.error('Error adding aircraft:', err)
      let errorMessage = 'Failed to add aircraft. Please try again.'
      if (err.message) {
        if (err.message.includes('permission') || err.message.includes('Permission')) {
          errorMessage = 'Permission denied. Please update Firestore security rules to allow writes.'
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
          <h2>Add New Aircraft</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="aircraft-form">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tailNumber">Tail Number *</label>
              <input
                type="text"
                id="tailNumber"
                name="tailNumber"
                value={formData.tailNumber}
                onChange={handleChange}
                placeholder="e.g., ET-ASB"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Aircraft Model *</label>
              <select
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              >
                <option value="">Select Model</option>
                <option value="Boeing 737-800">Boeing 737-800</option>
                <option value="Boeing 787-8">Boeing 787-8</option>
                <option value="Boeing 777-300ER">Boeing 777-300ER</option>
                <option value="Airbus A350-900">Airbus A350-900</option>
                <option value="Airbus A330-300">Airbus A330-300</option>
                <option value="Airbus A330-200">Airbus A330-200</option>
                <option value="Bombardier Q400">Bombardier Q400</option>
                <option value="CRJ-900">CRJ-900</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Available">Available</option>
                <option value="In Service">In Service</option>
                <option value="In Maintenance">In Maintenance</option>
                <option value="Out of Service">Out of Service</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="healthScore">Health Score (%)</label>
              <input
                type="number"
                id="healthScore"
                name="healthScore"
                value={formData.healthScore}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="100"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Addis Ababa Bole International Airport"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="flightHours">Flight Hours</label>
              <input
                type="number"
                id="flightHours"
                name="flightHours"
                value={formData.flightHours}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastMaintenance">Last Maintenance Date</label>
              <input
                type="date"
                id="lastMaintenance"
                name="lastMaintenance"
                value={formData.lastMaintenance}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
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
              {loading ? 'Adding...' : 'Add Aircraft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAircraftForm


