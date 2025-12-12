import { useState, useEffect } from 'react'
import './Dashboard.css'
import { subscribeToDashboardStats, getRecentMaintenance } from '../firebase/services/statsService'
import { subscribeToMaintenance } from '../firebase/services/maintenanceService'
import MaintenanceDetailsModal from './MaintenanceDetailsModal'

const Dashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalFlights: 0,
    activeFlights: 0,
    maintenanceDue: 0,
    aircraftAvailable: 0
  })
  const [recentMaintenance, setRecentMaintenance] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMaintenance, setSelectedMaintenance] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    // Subscribe to real-time dashboard stats updates
    const unsubscribeStats = subscribeToDashboardStats((dashboardStats) => {
      setStats(dashboardStats)
      setLoading(false)
    })

    // Subscribe to real-time maintenance updates for recent activities
    const unsubscribeMaintenance = subscribeToMaintenance((maintenanceData) => {
      const recent = maintenanceData
        .sort((a, b) => new Date(b.scheduledDate || b.date || 0) - new Date(a.scheduledDate || a.date || 0))
        .slice(0, 4)
      setRecentMaintenance(recent)
    })

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeStats()
      unsubscribeMaintenance()
    }
  }, [])

  const statCards = [
    {
      title: 'Total Flights',
      value: stats.totalFlights,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
        </svg>
      ),
      color: '#C8102E',
      change: '+12%'
    },
    {
      title: 'Active Flights',
      value: stats.activeFlights,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
        </svg>
      ),
      color: '#078930',
      change: '+5%'
    },
    {
      title: 'Maintenance Due',
      value: stats.maintenanceDue,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor"/>
        </svg>
      ),
      color: '#f59e0b',
      change: '-3%'
    },
    {
      title: 'Aircraft Available',
      value: stats.aircraftAvailable,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.56 3.44c.59.59.59 1.54 0 2.12l-2.12 2.12c-.59.59-1.54.59-2.12 0l-2.12-2.12c-.59-.59-.59-1.54 0-2.12l2.12-2.12c.59-.59 1.54-.59 2.12 0l2.12 2.12zM3 13h8v-2H3v2zm0 4h8v-2H3v2zm0-8h8V7H3v2zm0-4h8V3H3v2zm10 0h8V3h-8v2zm0 4h8V7h-8v2zm0 4h8v-2h-8v2zm0 4h8v-2h-8v2z" fill="currentColor"/>
        </svg>
      ),
      color: '#C8102E',
      change: '+8%'
    }
  ]

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Overview</h2>
          <p className="subtitle">Ethiopian Airlines maintenance operations at a glance</p>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Overview</h2>
        <p className="subtitle">Ethiopian Airlines maintenance operations at a glance</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <span className="stat-change" style={{ color: stat.color }}>
                {stat.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section-card maintenance-section">
          <div className="section-header">
            <h3>Recent Maintenance Activities</h3>
            {recentMaintenance.length > 0 && (
              <button 
                className="view-all-btn"
                onClick={() => {
                  if (setActiveTab) {
                    setActiveTab('maintenance')
                  }
                }}
              >
                View All →
              </button>
            )}
          </div>
          <div className="maintenance-list">
            {recentMaintenance.length > 0 ? (
              recentMaintenance.map((item) => (
                <div 
                  key={item.id} 
                  className="maintenance-item"
                  onClick={() => {
                    setSelectedMaintenance(item)
                    setShowDetailsModal(true)
                  }}
                >
                  <div className="maintenance-info">
                    <h4>{item.aircraft}</h4>
                    <p className="maintenance-type">{item.type}</p>
                    <span className="maintenance-date">{item.scheduledDate || item.date}</span>
                  </div>
                  <div className="maintenance-right">
                    <span className={`status-badge status-${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="view-icon">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-maintenance">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3, marginBottom: '0.5rem' }}>
                  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor"/>
                </svg>
                <p>No recent maintenance activities</p>
              </div>
            )}
          </div>
        </div>

        <div className="section-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button 
              className="action-btn secondary action-schedule"
              onClick={() => {
                if (setActiveTab) {
                  setActiveTab('maintenance')
                }
              }}
            >
              Schedule Maintenance
            </button>
            <button 
              className="action-btn secondary action-flight"
              onClick={() => {
                if (setActiveTab) {
                  setActiveTab('flights')
                  // Trigger add flight form after switching to flights tab
                  setTimeout(() => {
                    const addBtn = document.querySelector('.add-flight-btn')
                    if (addBtn) addBtn.click()
                  }, 100)
                }
              }}
            >
              Add Flight Record
            </button>
            <button 
              className="action-btn secondary action-reports"
              onClick={() => {
                alert('Reports feature coming soon!')
              }}
            >
              View Reports
            </button>
            <button 
              className="action-btn secondary action-aircraft"
              onClick={() => {
                if (setActiveTab) {
                  setActiveTab('aircraft')
                }
              }}
            >
              Manage Aircraft
            </button>
          </div>
        </div>
      </div>

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

export default Dashboard


