import { useState } from 'react'
import { addMaintenanceSchedule } from '../firebase/services/maintenanceService'
import './AddMaintenanceForm.css'

const AddMaintenanceForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    aircraft: '',
    tailNumber: '',
    type: 'Routine Check',
    scheduledDate: '',
    estimatedDuration: '4 hours',
    priority: 'Medium',
    status: 'Scheduled',
    technician: ''
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
      if (!formData.aircraft || !formData.tailNumber || !formData.scheduledDate || !formData.technician) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      await addMaintenanceSchedule(formData)
      
      // Reset form
      setFormData({
        aircraft: '',
        tailNumber: '',
        type: 'Routine Check',
        scheduledDate: '',
        estimatedDuration: '4 hours',
        priority: 'Medium',
        status: 'Scheduled',
        technician: ''
      })

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (err) {
      console.error('Error adding maintenance schedule:', err)
      let errorMessage = 'Failed to add maintenance schedule. Please try again.'
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
          <h2>Add New Maintenance Schedule</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="maintenance-form">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="aircraft">Aircraft Model *</label>
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
                <option value="Airbus A330-300">Airbus A330-300</option>
                <option value="Airbus A330-200">Airbus A330-200</option>
                <option value="Bombardier Q400">Bombardier Q400</option>
                <option value="CRJ-900">CRJ-900</option>
              </select>
            </div>

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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Maintenance Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Routine Check">Routine Check</option>
                <option value="Engine Inspection">Engine Inspection</option>
                <option value="Annual Service">Annual Service</option>
                <option value="Avionics Check">Avionics Check</option>
                <option value="Hydraulic System">Hydraulic System</option>
                <option value="Landing Gear">Landing Gear</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority *</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="scheduledDate">Scheduled Date *</label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estimatedDuration">Estimated Duration</label>
              <select
                id="estimatedDuration"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
              >
                <option value="2 hours">2 hours</option>
                <option value="4 hours">4 hours</option>
                <option value="8 hours">8 hours</option>
                <option value="12 hours">12 hours</option>
                <option value="24 hours">24 hours</option>
                <option value="48 hours">48 hours</option>
              </select>
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
                <option value="Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="technician">Technician Name *</label>
              <input
                type="text"
                id="technician"
                name="technician"
                value={formData.technician}
                onChange={handleChange}
                placeholder="e.g., Alemayehu Bekele"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMaintenanceForm


