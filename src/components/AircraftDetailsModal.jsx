import './AircraftDetailsModal.css'

const AircraftDetailsModal = ({ isOpen, onClose, aircraft }) => {
  if (!isOpen || !aircraft) return null

  const getStatusColor = (status) => {
    const colors = {
      'in-service': '#078930',
      'in-maintenance': '#FCDD09',
      'available': '#C8102E',
      'out-of-service': '#ef4444'
    }
    return colors[status?.toLowerCase()?.replace(' ', '-')] || '#6b7280'
  }

  const getHealthColor = (score) => {
    if (score >= 90) return '#078930'
    if (score >= 75) return '#FCDD09'
    return '#C8102E'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="aircraft-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Aircraft Details</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="details-section">
            <h3>Aircraft Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Tail Number:</span>
                <span className="detail-value">{aircraft.tailNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Model:</span>
                <span className="detail-value">{aircraft.model || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getStatusColor(aircraft.status) + '20', 
                      color: getStatusColor(aircraft.status) 
                    }}
                  >
                    {aircraft.status || 'N/A'}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{aircraft.location || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3>Maintenance & Health</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Health Score:</span>
                <span className="detail-value">
                  <span style={{ color: getHealthColor(aircraft.healthScore || 0), fontWeight: 700 }}>
                    {aircraft.healthScore || 0}%
                  </span>
                </span>
              </div>
              <div className="detail-item full-width">
                <div className="health-bar-container">
                  <div className="health-bar">
                    <div 
                      className="health-bar-fill"
                      style={{ 
                        width: `${aircraft.healthScore || 0}%`,
                        backgroundColor: getHealthColor(aircraft.healthScore || 0)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">Flight Hours:</span>
                <span className="detail-value">
                  {aircraft.flightHours ? aircraft.flightHours.toLocaleString() + ' hrs' : 'N/A'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Maintenance:</span>
                <span className="detail-value">{aircraft.lastMaintenance || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Next Maintenance:</span>
                <span className="detail-value">{aircraft.nextMaintenance || 'N/A'}</span>
              </div>
            </div>
          </div>

          {(aircraft.createdAt || aircraft.updatedAt) && (
            <div className="details-section">
              <h3>Timestamps</h3>
              <div className="details-grid">
                {aircraft.createdAt && (
                  <div className="detail-item">
                    <span className="detail-label">Created At:</span>
                    <span className="detail-value">
                      {new Date(aircraft.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {aircraft.updatedAt && (
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">
                      {new Date(aircraft.updatedAt).toLocaleString()}
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

export default AircraftDetailsModal


