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

const AIRCRAFT_COLLECTION = 'aircraft'

// Get all aircraft
export const getAircraft = async () => {
  try {
    const aircraftRef = collection(db, AIRCRAFT_COLLECTION)
    const q = query(aircraftRef, orderBy('tailNumber'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching aircraft:', error)
    throw error
  }
}

// Get aircraft in real-time
export const subscribeToAircraft = (callback) => {
  const aircraftRef = collection(db, AIRCRAFT_COLLECTION)
  const q = query(aircraftRef, orderBy('tailNumber'))
  
  return onSnapshot(q, (snapshot) => {
    const aircraft = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(aircraft)
  }, (error) => {
    console.error('Error subscribing to aircraft:', error)
    callback([])
  })
}

// Get aircraft by ID
export const getAircraftById = async (id) => {
  try {
    const aircraftRef = doc(db, AIRCRAFT_COLLECTION, id)
    const snapshot = await getDocs(collection(db, AIRCRAFT_COLLECTION))
    const aircraftDoc = snapshot.docs.find(d => d.id === id)
    if (aircraftDoc) {
      return { id: aircraftDoc.id, ...aircraftDoc.data() }
    }
    return null
  } catch (error) {
    console.error('Error fetching aircraft:', error)
    throw error
  }
}

// Add a new aircraft
export const addAircraft = async (aircraftData) => {
  try {
    const aircraftRef = collection(db, AIRCRAFT_COLLECTION)
    const docRef = await addDoc(aircraftRef, {
      ...aircraftData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding aircraft:', error)
    throw error
  }
}

// Update an aircraft
export const updateAircraft = async (id, aircraftData) => {
  try {
    const aircraftRef = doc(db, AIRCRAFT_COLLECTION, id)
    await updateDoc(aircraftRef, {
      ...aircraftData,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating aircraft:', error)
    throw error
  }
}

// Delete an aircraft
export const deleteAircraft = async (id) => {
  try {
    const aircraftRef = doc(db, AIRCRAFT_COLLECTION, id)
    await deleteDoc(aircraftRef)
  } catch (error) {
    console.error('Error deleting aircraft:', error)
    throw error
  }
}

// Filter aircraft by status
export const getAircraftByStatus = async (status) => {
  try {
    const aircraftRef = collection(db, AIRCRAFT_COLLECTION)
    const q = query(aircraftRef, where('status', '==', status))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching aircraft by status:', error)
    throw error
  }
}



