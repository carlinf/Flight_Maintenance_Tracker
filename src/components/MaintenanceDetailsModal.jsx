import './MaintenanceDetailsModal.css'

const MaintenanceDetailsModal = ({ isOpen, onClose, maintenance }) => {
  if (!isOpen || !maintenance) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="maintenance-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Maintenance Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="details-section">
            <h3>Aircraft Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Aircraft Model:</span>
                <span className="detail-value">{maintenance.aircraft || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tail Number:</span>
                <span className="detail-value">{maintenance.tailNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Maintenance Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{maintenance.type || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority:</span>
                <span className="detail-value">
                  <span 
                    className="priority-badge"
                    style={{ 
                      backgroundColor: getPriorityColor(maintenance.priority) + '20', 
                      color: getPriorityColor(maintenance.priority) 
                    }}
                  >
                    {maintenance.priority || 'N/A'}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(maintenance.status) }}
                  >
                    {maintenance.status || 'N/A'}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Scheduled Date:</span>
                <span className="detail-value">{maintenance.scheduledDate || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Estimated Duration:</span>
                <span className="detail-value">{maintenance.estimatedDuration || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Technician:</span>
                <span className="detail-value">{maintenance.technician || 'N/A'}</span>
              </div>
            </div>
          </div>

          {(maintenance.createdAt || maintenance.updatedAt) && (
            <div className="details-section">
              <h3>Timestamps</h3>
              <div className="details-grid">
                {maintenance.createdAt && (
                  <div className="detail-item">
                    <span className="detail-label">Created At:</span>
                    <span className="detail-value">
                      {new Date(maintenance.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {maintenance.updatedAt && (
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">
                      {new Date(maintenance.updatedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-close-modal" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const getPriorityColor = (priority) => {
  const colors = {
    'high': '#C8102E',
    'medium': '#FCDD09',
    'low': '#078930'
  }
  return colors[priority?.toLowerCase()] || '#6b7280'
}

const getStatusColor = (status) => {
  const colors = {
    'scheduled': '#C8102E',
    'in-progress': '#FCDD09',
    'completed': '#078930',
    'pending': '#6b7280'
  }
  return colors[status?.toLowerCase()?.replace(' ', '-')] || '#6b7280'
}

export default MaintenanceDetailsModal


