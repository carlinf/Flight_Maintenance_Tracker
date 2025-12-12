import { getFlights } from './flightsService'
import { getMaintenanceSchedules } from './maintenanceService'
import { getAircraft } from './aircraftService'
import { subscribeToFlights } from './flightsService'
import { subscribeToMaintenance } from './maintenanceService'
import { subscribeToAircraft } from './aircraftService'

// Calculate stats from data arrays
const calculateStats = (flights, maintenance, aircraft) => {
  const totalFlights = flights.length
  const activeFlights = flights.filter(f => 
    f.status === 'On Time' || f.status === 'In Service'
  ).length
  
  // Maintenance Due: Counts maintenance schedules that are scheduled or pending
  // PLUS flights that have maintenance status "Due Soon" or "Maintenance Required"
  const maintenanceSchedulesDue = maintenance.filter(m => 
    m.status === 'Scheduled' || m.status === 'Pending' || m.status === 'In Progress'
  ).length
  
  const flightsWithMaintenanceDue = flights.filter(f => 
    f.maintenanceStatus === 'Due Soon' || f.maintenanceStatus === 'Maintenance Required'
  ).length
  
  const maintenanceDue = maintenanceSchedulesDue + flightsWithMaintenanceDue
  
  // Aircraft Available: Counts only aircraft with status "Available"
  const aircraftAvailable = aircraft.filter(a => 
    a.status === 'Available'
  ).length

  return {
    totalFlights,
    activeFlights,
    maintenanceDue,
    aircraftAvailable
  }
}

// Get dashboard statistics (one-time fetch)
export const getDashboardStats = async () => {
  try {
    const [flights, maintenance, aircraft] = await Promise.all([
      getFlights(),
      getMaintenanceSchedules(),
      getAircraft()
    ])

    return calculateStats(flights, maintenance, aircraft)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalFlights: 0,
      activeFlights: 0,
      maintenanceDue: 0,
      aircraftAvailable: 0
    }
  }
}

// Subscribe to dashboard statistics in real-time
export const subscribeToDashboardStats = (callback) => {
  let flights = []
  let maintenance = []
  let aircraft = []

  const updateStats = () => {
    const stats = calculateStats(flights, maintenance, aircraft)
    callback(stats)
  }

  // Subscribe to all three collections
  const unsubscribeFlights = subscribeToFlights((flightsData) => {
    flights = flightsData
    updateStats()
  })

  const unsubscribeMaintenance = subscribeToMaintenance((maintenanceData) => {
    maintenance = maintenanceData
    updateStats()
  })

  const unsubscribeAircraft = subscribeToAircraft((aircraftData) => {
    aircraft = aircraftData
    updateStats()
  })

  // Return a function to unsubscribe from all
  return () => {
    unsubscribeFlights()
    unsubscribeMaintenance()
    unsubscribeAircraft()
  }
}

// Get recent maintenance activities
export const getRecentMaintenance = async (limit = 4) => {
  try {
    const maintenance = await getMaintenanceSchedules()
    return maintenance
      .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching recent maintenance:', error)
    return []
  }
}


