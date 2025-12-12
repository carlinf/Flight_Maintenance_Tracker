import { useState, useEffect } from 'react'
import './FlightList.css'
import { subscribeToFlights, updateFlight } from '../firebase/services/flightsService'
import AddFlightForm from './AddFlightForm'
import StatusEditModal from './StatusEditModal'

const FlightList = () => {
  const [flights, setFlights] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)

  useEffect(() => {
    // Subscribe to real-time flight updates
    const unsubscribe = subscribeToFlights((flightsData) => {
      setFlights(flightsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredFlights = filter === 'all' 
    ? flights 
    : flights.filter(flight => {
        if (filter === 'maintenance-due') {
          return flight.maintenanceStatus === 'Due Soon' || flight.maintenanceStatus === 'Maintenance Required'
        }
        return flight.status.toLowerCase().replace(' ', '-') === filter
      })

  const getStatusColor = (status) => {
    const colors = {
      'on-time': '#078930',
      'delayed': '#FCDD09',
      'cancelled': '#ef4444'
    }
    return colors[status.toLowerCase().replace(' ', '-')] || '#6b7280'
  }

  const getMaintenanceColor = (status) => {
    const colors = {
      'good': '#078930',
      'due-soon': '#FCDD09',
      'maintenance-required': '#C8102E'
    }
    return colors[status.toLowerCase().replace(' ', '-')] || '#6b7280'
  }

  const handleEditStatus = (flight) => {
    setSelectedFlight(flight)
    setShowStatusModal(true)
  }

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedFlight) return

    try {
      await updateFlight(selectedFlight.id, { status: newStatus })
      setShowStatusModal(false)
      setSelectedFlight(null)
    } catch (error) {
      console.error('Error updating flight status:', error)
      alert('Failed to update flight status. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flight-list">
        <div className="flight-list-header">
          <h2>Flight Management</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading flights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flight-list">
      <div className="flight-list-header">
        <h2>Flight Management</h2>
        <div className="header-actions">
          <button 
            className="add-flight-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add Flight Record
          </button>
          <div className="filters">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All Flights
            </button>
            <button 
              className={filter === 'on-time' ? 'active' : ''}
              onClick={() => setFilter('on-time')}
            >
              On Time
            </button>
            <button 
              className={filter === 'delayed' ? 'active' : ''}
              onClick={() => setFilter('delayed')}
            >
              Delayed
            </button>
            <button 
              className={filter === 'maintenance-due' ? 'active' : ''}
              onClick={() => setFilter('maintenance-due')}
            >
              Maintenance Due
            </button>
          </div>
        </div>
      </div>

      <div className="flights-table">
        <div className="table-header">
          <div className="col-flight">Flight</div>
          <div className="col-aircraft">Aircraft</div>
          <div className="col-route">Route</div>
          <div className="col-status">Status</div>
          <div className="col-maintenance">Maintenance</div>
          <div className="col-hours">Flight Hours</div>
          <div className="col-next">Next Service</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
            <div key={flight.id} className="table-row">
              <div className="col-flight">
                <strong>{flight.flightNumber}</strong>
              </div>
              <div className="col-aircraft">{flight.aircraft}</div>
              <div className="col-route">{flight.route}</div>
              <div className="col-status">
                <span 
                  className="status-dot" 
                  style={{ backgroundColor: getStatusColor(flight.status) }}
                ></span>
                {flight.status}
              </div>
              <div className="col-maintenance">
                <span 
                  className="maintenance-badge"
                  style={{ backgroundColor: `${getMaintenanceColor(flight.maintenanceStatus)}20`, color: getMaintenanceColor(flight.maintenanceStatus) }}
                >
                  {flight.maintenanceStatus}
                </span>
              </div>
              <div className="col-hours">{flight.hours.toLocaleString()} hrs</div>
              <div className="col-next">{flight.nextMaintenance}</div>
              <div className="col-actions">
                <button 
                  className="btn-edit-status"
                  onClick={() => handleEditStatus(flight)}
                  title="Edit Status"
                >
                  Edit Status
                </button>
              </div>
            </div>
            ))
          ) : (
            <div className="table-row" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#6b7280' }}>No flights found</p>
            </div>
          )}
        </div>
      </div>

      <AddFlightForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={() => {
          // Form will close and real-time subscription will update automatically
          console.log('Flight added successfully')
        }}
      />

      <StatusEditModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false)
          setSelectedFlight(null)
        }}
        currentStatus={selectedFlight?.status}
        onUpdate={handleStatusUpdate}
        statusOptions={['On Time', 'Delayed', 'Cancelled']}
      />
    </div>
  )
}

export default FlightList


