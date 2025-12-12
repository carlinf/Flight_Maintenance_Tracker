import { useState, useEffect } from 'react'
import './MaintenanceSchedule.css'
import { subscribeToMaintenance, updateMaintenanceSchedule, deleteMaintenanceSchedule } from '../firebase/services/maintenanceService'
import AddMaintenanceForm from './AddMaintenanceForm'
import MaintenanceDetailsModal from './MaintenanceDetailsModal'

const MaintenanceSchedule = () => {
  const [schedule, setSchedule] = useState([])
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    // Subscribe to real-time maintenance updates
    const unsubscribe = subscribeToMaintenance((schedules) => {
      setSchedule(schedules)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredSchedule = schedule.filter(item => {
    // Filter by type
    const matchesType = selectedType === 'all' || item.type.toLowerCase().includes(selectedType.toLowerCase())
    
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || 
      item.status.toLowerCase().replace(' ', '-') === selectedStatus.toLowerCase()
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      item.aircraft?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tailNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.technician?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesType && matchesStatus && matchesSearch
  })

  const getPriorityColor = (priority) => {
    const colors = {
      'high': '#C8102E',
      'medium': '#FCDD09',
      'low': '#078930'
    }
    return colors[priority.toLowerCase()] || '#6b7280'
  }

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': '#C8102E',
      'in-progress': '#FCDD09',
      'completed': '#078930',
      'pending': '#6b7280'
    }
    return colors[status.toLowerCase().replace(' ', '-')] || '#6b7280'
  }

  const handleStatusUpdate = async (id, updateData) => {
    try {
      await updateMaintenanceSchedule(id, updateData)
    } catch (error) {
      console.error('Error updating maintenance status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance schedule?')) {
      try {
        await deleteMaintenanceSchedule(id)
      } catch (error) {
        console.error('Error deleting maintenance schedule:', error)
        alert('Failed to delete schedule. Please try again.')
      }
    }
  }


  const maintenanceTypes = ['all', 'routine', 'engine', 'annual', 'avionics', 'hydraulic', 'landing']
  const statusFilters = ['all', 'scheduled', 'in-progress', 'completed', 'pending']

  if (loading) {
    return (
      <div className="maintenance-schedule">
        <div className="schedule-header">
          <h2>Maintenance Schedule</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading maintenance schedules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="maintenance-schedule">
      <div className="schedule-header">
        <h2>Maintenance Schedule</h2>
        <button 
          className="add-maintenance-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Schedule
        </button>
      </div>

      <div className="schedule-controls">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by aircraft, tail number, technician..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="type-filters">
            {maintenanceTypes.map((type) => (
              <button
                key={type}
                className={selectedType === type ? 'active' : ''}
                onClick={() => setSelectedType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="status-filters">
            <span className="filter-label">Status:</span>
            {statusFilters.map((status) => (
              <button
                key={status}
                className={`status-filter ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="schedule-grid">
        {filteredSchedule.length > 0 ? (
          filteredSchedule.map((item) => (
          <div key={item.id} className="schedule-card">
            <div className="schedule-card-header">
              <div>
                <h3>{item.aircraft}</h3>
                <p className="tail-number">{item.tailNumber}</p>
              </div>
              <span 
                className="priority-badge"
                style={{ backgroundColor: `${getPriorityColor(item.priority)}20`, color: getPriorityColor(item.priority) }}
              >
                {item.priority}
              </span>
            </div>

            <div className="schedule-card-body">
              <div className="schedule-info">
                <div className="info-item">
                  <span className="info-label">Type:</span>
                  <span className="info-value">{item.type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Scheduled:</span>
                  <span className="info-value">{item.scheduledDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{item.estimatedDuration}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Technician:</span>
                  <span className="info-value">{item.technician}</span>
                </div>
              </div>

              <div className="schedule-status">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(item.status) }}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <div className="schedule-card-actions">
              <button 
                className="btn-view"
                onClick={() => {
                  setSelectedMaintenance(item)
                  setShowDetailsModal(true)
                }}
              >
                View Details
              </button>
              {item.status === 'Scheduled' && (
                <button 
                  className="btn-reschedule"
                  onClick={() => {
                    const newDate = prompt('Enter new scheduled date (YYYY-MM-DD):', item.scheduledDate)
                    if (newDate) {
                      handleStatusUpdate(item.id, { scheduledDate: newDate })
                    }
                  }}
                >
                  Reschedule
                </button>
              )}
              {item.status === 'Scheduled' || item.status === 'Pending' ? (
                <button 
                  className="btn-complete"
                  onClick={() => handleStatusUpdate(item.id, { status: 'Completed' })}
                >
                  Mark Complete
                </button>
              ) : null}
              <button 
                className="btn-delete"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#6b7280' }}>No maintenance schedules found</p>
          </div>
        )}
      </div>

      <AddMaintenanceForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={() => {
          setShowAddForm(false)
        }}
      />

      <MaintenanceDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedMaintenance(null)
        }}
        maintenance={selectedMaintenance}
      />
    </div>
  )
}

export default MaintenanceSchedule


