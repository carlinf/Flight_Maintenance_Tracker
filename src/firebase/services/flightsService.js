import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../config'

const FLIGHTS_COLLECTION = 'flights'

// Get all flights
export const getFlights = async () => {
  try {
    const flightsRef = collection(db, FLIGHTS_COLLECTION)
    const q = query(flightsRef, orderBy('flightNumber'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching flights:', error)
    throw error
  }
}

// Get flights in real-time
export const subscribeToFlights = (callback) => {
  const flightsRef = collection(db, FLIGHTS_COLLECTION)
  const q = query(flightsRef, orderBy('flightNumber'))
  
  return onSnapshot(q, (snapshot) => {
    const flights = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(flights)
  }, (error) => {
    console.error('Error subscribing to flights:', error)
    callback([])
  })
}

// Get flight by ID
export const getFlightById = async (id) => {
  try {
    const flightRef = doc(db, FLIGHTS_COLLECTION, id)
    const snapshot = await getDocs(collection(db, FLIGHTS_COLLECTION))
    const flightDoc = snapshot.docs.find(d => d.id === id)
    if (flightDoc) {
      return { id: flightDoc.id, ...flightDoc.data() }
    }
    return null
  } catch (error) {
    console.error('Error fetching flight:', error)
    throw error
  }
}

// Add a new flight
export const addFlight = async (flightData) => {
  try {
    // Validate required fields
    if (!flightData.flightNumber || !flightData.aircraft || !flightData.route) {
      throw new Error('Missing required fields: flightNumber, aircraft, or route')
    }

    const flightsRef = collection(db, FLIGHTS_COLLECTION)
    const docRef = await addDoc(flightsRef, {
      flightNumber: flightData.flightNumber,
      aircraft: flightData.aircraft,
      route: flightData.route,
      status: flightData.status || 'On Time',
      maintenanceStatus: flightData.maintenanceStatus || 'Good',
      nextMaintenance: flightData.nextMaintenance || '',
      hours: flightData.hours || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    console.log('Flight added successfully with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error adding flight:', error)
    console.error('Flight data:', flightData)
    // Re-throw with more context
    throw new Error(error.message || 'Failed to add flight to Firestore')
  }
}

// Update a flight
export const updateFlight = async (id, flightData) => {
  try {
    const flightRef = doc(db, FLIGHTS_COLLECTION, id)
    await updateDoc(flightRef, {
      ...flightData,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating flight:', error)
    throw error
  }
}

// Delete a flight
export const deleteFlight = async (id) => {
  try {
    const flightRef = doc(db, FLIGHTS_COLLECTION, id)
    await deleteDoc(flightRef)
  } catch (error) {
    console.error('Error deleting flight:', error)
    throw error
  }
}

// Filter flights by status
export const getFlightsByStatus = async (status) => {
  try {
    const flightsRef = collection(db, FLIGHTS_COLLECTION)
    const q = query(flightsRef, where('status', '==', status))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching flights by status:', error)
    throw error
  }
}


