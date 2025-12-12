import { useState, useEffect } from 'react'
import './StatusEditModal.css'

const StatusEditModal = ({ isOpen, onClose, currentStatus, onUpdate, statusOptions = ['On Time', 'Delayed', 'Cancelled'] }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus || '')

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus || '')
    }
  }, [isOpen, currentStatus])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedStatus && selectedStatus !== currentStatus) {
      onUpdate(selectedStatus)
    }
    onClose()
  }

  const handleCancel = () => {
    setSelectedStatus(currentStatus || '')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="status-modal-overlay" onClick={handleCancel}>
      <div className="status-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="status-modal-header">
          <h3>Update Status</h3>
        </div>
        <form onSubmit={handleSubmit} className="status-modal-form">
          <div className="status-form-group">
            <label htmlFor="status-select">
              Update status ({statusOptions.join(', ')}):
            </label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-select"
              autoFocus
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="status-modal-actions">
            <button type="button" className="status-btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="status-btn-ok">
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StatusEditModal
