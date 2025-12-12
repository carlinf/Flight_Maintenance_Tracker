// Sample data for seeding Firebase Firestore
// Run this script to populate your Firestore database with sample Ethiopian Airlines data

import { addFlight } from '../firebase/services/flightsService'
import { addMaintenanceSchedule } from '../firebase/services/maintenanceService'
import { addAircraft } from '../firebase/services/aircraftService'

export const seedFlights = async () => {
  const flights = [
    {
      flightNumber: 'ET701',
      aircraft: 'Boeing 737-800',
      route: 'ADD → DXB',
      status: 'On Time',
      maintenanceStatus: 'Good',
      nextMaintenance: '2024-02-01',
      hours: 1250
    },
    {
      flightNumber: 'ET500',
      aircraft: 'Airbus A350-900',
      route: 'ADD → LHR',
      status: 'Delayed',
      maintenanceStatus: 'Due Soon',
      nextMaintenance: '2024-01-25',
      hours: 1980
    },
    {
      flightNumber: 'ET702',
      aircraft: 'Boeing 787-8',
      route: 'ADD → BRU',
      status: 'On Time',
      maintenanceStatus: 'Good',
      nextMaintenance: '2024-02-15',
      hours: 890
    },
    {
      flightNumber: 'ET302',
      aircraft: 'Boeing 737-800',
      route: 'ADD → NBO',
      status: 'On Time',
      maintenanceStatus: 'Good',
      nextMaintenance: '2024-02-20',
      hours: 650
    },
    {
      flightNumber: 'ET808',
      aircraft: 'Boeing 777-300ER',
      route: 'ADD → JNB',
      status: 'Cancelled',
      maintenanceStatus: 'Maintenance Required',
      nextMaintenance: '2024-01-18',
      hours: 2100
    },
    {
      flightNumber: 'ET330',
      aircraft: 'Bombardier Q400',
      route: 'ADD → EBB',
      status: 'On Time',
      maintenanceStatus: 'Good',
      nextMaintenance: '2024-02-05',
      hours: 1450
    },
    {
      flightNumber: 'ET400',
      aircraft: 'Boeing 737-800',
      route: 'ADD → CAI',
      status: 'On Time',
      maintenanceStatus: 'Good',
      nextMaintenance: '2024-02-10',
      hours: 1120
    },
    {
      flightNumber: 'ET501',
      aircraft: 'Airbus A350-900',
      route: 'ADD → CDG',
      status: 'On Time',
      maintenanceStatus: 'Good',
      nextMaintenance: '2024-02-25',
      hours: 980
    }
  ]

  try {
    for (const flight of flights) {
      await addFlight(flight)
      console.log(`Added flight: ${flight.flightNumber}`)
    }
    console.log('All flights seeded successfully!')
  } catch (error) {
    console.error('Error seeding flights:', error)
  }
}

export const seedMaintenance = async () => {
  const maintenance = [
    {
      aircraft: 'Boeing 737-800',
      tailNumber: 'ET-ASB',
      type: 'Routine Check',
      scheduledDate: '2024-01-25',
      estimatedDuration: '4 hours',
      priority: 'Medium',
      status: 'Scheduled',
      technician: 'Alemayehu Bekele'
    },
    {
      aircraft: 'Airbus A330-300',
      tailNumber: 'ET-ATL',
      type: 'Engine Inspection',
      scheduledDate: '2024-01-18',
      estimatedDuration: '8 hours',
      priority: 'High',
      status: 'In Progress',
      technician: 'Meron Tadesse'
    },
    {
      aircraft: 'Airbus A330-200',
      tailNumber: 'ET-AYB',
      type: 'Annual Service',
      scheduledDate: '2024-02-01',
      estimatedDuration: '24 hours',
      priority: 'High',
      status: 'Scheduled',
      technician: 'Yonas Gebremariam'
    },
    {
      aircraft: 'CRJ-900',
      tailNumber: 'ET-AQC',
      type: 'Avionics Update',
      scheduledDate: '2024-01-20',
      estimatedDuration: '6 hours',
      priority: 'Low',
      status: 'Completed',
      technician: 'Selamawit Assefa'
    },
    {
      aircraft: 'Boeing 737-800',
      tailNumber: 'ET-AVD',
      type: 'Hydraulic System Check',
      scheduledDate: '2024-01-22',
      estimatedDuration: '3 hours',
      priority: 'Medium',
      status: 'Scheduled',
      technician: 'Tewodros Haile'
    },
    {
      aircraft: 'Dash 8-400',
      tailNumber: 'ET-AWE',
      type: 'Landing Gear Inspection',
      scheduledDate: '2024-01-19',
      estimatedDuration: '5 hours',
      priority: 'High',
      status: 'Pending',
      technician: 'Hanna Getachew'
    },
    {
      aircraft: 'Boeing 737-800',
      tailNumber: 'ET-AXF',
      type: 'Routine Check',
      scheduledDate: '2024-01-23',
      estimatedDuration: '4 hours',
      priority: 'Medium',
      status: 'Scheduled',
      technician: 'Daniel Mekonnen'
    }
  ]

  try {
    for (const item of maintenance) {
      await addMaintenanceSchedule(item)
      console.log(`Added maintenance: ${item.aircraft} - ${item.type}`)
    }
    console.log('All maintenance schedules seeded successfully!')
  } catch (error) {
    console.error('Error seeding maintenance:', error)
  }
}

export const seedAircraft = async () => {
  const aircraft = [
    {
      tailNumber: 'ET-ASB',
      model: 'Boeing 737-800',
      status: 'In Service',
      location: 'Addis Ababa Bole International Airport',
      flightHours: 1250,
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-02-01',
      healthScore: 95
    },
    {
      tailNumber: 'ET-ATL',
      model: 'Airbus A330-300',
      status: 'In Maintenance',
      location: 'Addis Ababa Maintenance Hangar',
      flightHours: 1980,
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-01-18',
      healthScore: 78
    },
    {
      tailNumber: 'ET-AYB',
      model: 'Airbus A330-200',
      status: 'In Service',
      location: 'Dubai International Airport',
      flightHours: 890,
      lastMaintenance: '2024-01-12',
      nextMaintenance: '2024-02-15',
      healthScore: 98
    },
    {
      tailNumber: 'ET-AQC',
      model: 'CRJ-900',
      status: 'In Service',
      location: 'Nairobi Jomo Kenyatta Airport',
      flightHours: 650,
      lastMaintenance: '2024-01-14',
      nextMaintenance: '2024-02-20',
      healthScore: 92
    },
    {
      tailNumber: 'ET-AVD',
      model: 'Boeing 737-800',
      status: 'Available',
      location: 'Addis Ababa Bole International Airport',
      flightHours: 2100,
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-01-22',
      healthScore: 85
    },
    {
      tailNumber: 'ET-AWE',
      model: 'Dash 8-400',
      status: 'In Service',
      location: 'Entebbe International Airport',
      flightHours: 1450,
      lastMaintenance: '2024-01-11',
      nextMaintenance: '2024-02-05',
      healthScore: 90
    },
    {
      tailNumber: 'ET-AXF',
      model: 'Boeing 737-800',
      status: 'In Service',
      location: 'London Heathrow Airport',
      flightHours: 1120,
      lastMaintenance: '2024-01-13',
      nextMaintenance: '2024-02-10',
      healthScore: 93
    },
    {
      tailNumber: 'ET-AYG',
      model: 'Airbus A330-200',
      status: 'In Service',
      location: 'Brussels Airport',
      flightHours: 980,
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-02-25',
      healthScore: 96
    }
  ]

  try {
    for (const plane of aircraft) {
      await addAircraft(plane)
      console.log(`Added aircraft: ${plane.tailNumber}`)
    }
    console.log('All aircraft seeded successfully!')
  } catch (error) {
    console.error('Error seeding aircraft:', error)
  }
}

export const seedAll = async () => {
  console.log('Starting to seed Firebase database...')
  await seedFlights()
  await seedMaintenance()
  await seedAircraft()
  console.log('Seeding completed!')
}


