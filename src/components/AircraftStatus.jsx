import { useState, useEffect } from 'react'
import './AircraftStatus.css'
import { subscribeToAircraft, updateAircraft, deleteAircraft } from '../firebase/services/aircraftService'
import AddAircraftForm from './AddAircraftForm'
import AircraftDetailsModal from './AircraftDetailsModal'
import StatusEditModal from './StatusEditModal'
import MessageModal from './MessageModal'
import ConfirmationModal from './ConfirmationModal'

const AircraftStatus = () => {
  const [aircraft, setAircraft] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedAircraft, setSelectedAircraft] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [aircraftForStatusEdit, setAircraftForStatusEdit] = useState(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [aircraftToDelete, setAircraftToDelete] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Subscribe to real-time aircraft updates
    const unsubscribe = subscribeToAircraft((aircraftData) => {
      setAircraft(aircraftData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      'in-service': '#078930',
      'in-maintenance': '#FCDD09',
      'available': '#C8102E',
      'out-of-service': '#ef4444'
    }
    return colors[status.toLowerCase().replace(' ', '-')] || '#6b7280'
  }

  const getHealthColor = (score) => {
    if (score >= 90) return '#078930'
    if (score >= 75) return '#FCDD09'
    return '#C8102E'
  }

  const handleStatusUpdate = async (id, updateData) => {
    try {
      await updateAircraft(id, updateData)
    } catch (error) {
      console.error('Error updating aircraft:', error)
      alert('Failed to update aircraft. Please try again.')
    }
  }

  const handleEditStatus = (plane) => {
    setAircraftForStatusEdit(plane)
    setShowStatusModal(true)
  }

  const handleStatusUpdateFromModal = async (newStatus) => {
    if (!aircraftForStatusEdit) return

    try {
      await handleStatusUpdate(aircraftForStatusEdit.id, { status: newStatus })
      setShowStatusModal(false)
      setAircraftForStatusEdit(null)
    } catch (error) {
      console.error('Error updating aircraft status:', error)
      alert('Failed to update aircraft status. Please try again.')
    }
  }

  const handleDeleteClick = (plane) => {
    setAircraftToDelete(plane)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!aircraftToDelete) return

    try {
      await deleteAircraft(aircraftToDelete.id)
      setAircraftToDelete(null)
    } catch (error) {
      console.error('Error deleting aircraft:', error)
      alert('Failed to delete aircraft. Please try again.')
    }
  }

  const filteredAircraft = aircraft.filter(plane => {
    // Filter by status
    const matchesStatus = selectedStatus === 'all' || 
      plane.status.toLowerCase().replace(' ', '-') === selectedStatus.toLowerCase()
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      plane.tailNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plane.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plane.location?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const statusFilters = ['all', 'in-service', 'available', 'in-maintenance', 'out-of-service']

  if (loading) {
    return (
      <div className="aircraft-status">
        <div className="aircraft-header">
          <h2>Aircraft Status</h2>
          <p className="subtitle">Real-time status of Ethiopian Airlines fleet</p>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading aircraft data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="aircraft-status">
      <div className="aircraft-header">
        <div>
          <h2>Aircraft Status</h2>
          <p className="subtitle">Real-time status of Ethiopian Airlines fleet</p>
        </div>
        <button 
          className="add-aircraft-btn"
          onClick={() => setShowAddForm(true)}
        >
          + Add Aircraft
        </button>
      </div>

      <div className="aircraft-controls">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by tail number, model, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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

      <div className="aircraft-grid">
        {filteredAircraft.length > 0 ? (
          filteredAircraft.map((plane) => (
          <div key={plane.id} className="aircraft-card">
            <div className="aircraft-card-header">
              <div>
                <h3>{plane.tailNumber}</h3>
                <p className="aircraft-model">{plane.model}</p>
              </div>
              <span 
                className="status-badge"
                style={{ backgroundColor: `${getStatusColor(plane.status)}20`, color: getStatusColor(plane.status) }}
              >
                {plane.status}
              </span>
            </div>

            <div className="aircraft-card-body">
              <div className="health-score">
                <div className="health-score-header">
                  <span>Health Score</span>
                  <span 
                    className="health-value"
                    style={{ color: getHealthColor(plane.healthScore || 0) }}
                  >
                    {plane.healthScore || 0}%
                  </span>
                </div>
                <div className="health-bar">
                  <div 
                    className="health-bar-fill"
                    style={{ 
                      width: `${plane.healthScore || 0}%`,
                      backgroundColor: getHealthColor(plane.healthScore || 0)
                    }}
                  ></div>
                </div>
              </div>

              <div className="aircraft-details">
                <div className="detail-item">
                  <span className="detail-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                    </svg>
                    Location
                  </span>
                  <span className="detail-value">{plane.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
                    </svg>
                    Flight Hours
                  </span>
                  <span className="detail-value">{plane.flightHours.toLocaleString()} hrs</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor"/>
                    </svg>
                    Last Maintenance
                  </span>
                  <span className="detail-value">{plane.lastMaintenance}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }}>
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill="currentColor"/>
                    </svg>
                    Next Maintenance
                  </span>
                  <span className="detail-value">{plane.nextMaintenance}</span>
                </div>
              </div>
            </div>

            <div className="aircraft-card-footer">
              <button 
                className="btn-details"
                onClick={() => {
                  setSelectedAircraft(plane)
                  setShowDetailsModal(true)
                }}
              >
                View Details
              </button>
              <button 
                className="btn-maintenance"
                onClick={() => setShowMessageModal(true)}
              >
                Schedule Maintenance
              </button>
              <button 
                className="btn-edit"
                onClick={() => handleEditStatus(plane)}
              >
                Edit Status
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteClick(plane)}
              >
                Delete
              </button>
            </div>
          </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto', opacity: 0.3 }}>
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
              </svg>
            </div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1rem' }}>
              {aircraft.length === 0 
                ? 'No aircraft found. Add your first aircraft to get started!'
                : 'No aircraft match your filters. Try adjusting your search or filters.'}
            </p>
            {aircraft.length === 0 && (
              <button 
                className="add-aircraft-btn"
                onClick={() => setShowAddForm(true)}
                style={{ marginTop: '1rem' }}
              >
                + Add First Aircraft
              </button>
            )}
          </div>
        )}
      </div>

      <AddAircraftForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={() => {
          setShowAddForm(false)
        }}
      />

      <AircraftDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedAircraft(null)
        }}
        aircraft={selectedAircraft}
      />

      <StatusEditModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false)
          setAircraftForStatusEdit(null)
        }}
        currentStatus={aircraftForStatusEdit?.status}
        onUpdate={handleStatusUpdateFromModal}
        statusOptions={['Available', 'In Service', 'In Maintenance', 'Out of Service']}
      />

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        message="Please go to Maintenance page."
        title="Schedule Maintenance"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setAircraftToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        message={`Are you sure you want to delete aircraft ${aircraftToDelete?.tailNumber}? This action cannot be undone.`}
        title="Delete Aircraft"
      />
    </div>
  )
}

export default AircraftStatus


