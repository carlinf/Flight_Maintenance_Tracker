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

const MAINTENANCE_COLLECTION = 'maintenance'

// Get all maintenance schedules
export const getMaintenanceSchedules = async () => {
  try {
    const maintenanceRef = collection(db, MAINTENANCE_COLLECTION)
    const q = query(maintenanceRef, orderBy('scheduledDate'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching maintenance schedules:', error)
    throw error
  }
}

// Get maintenance schedules in real-time
export const subscribeToMaintenance = (callback) => {
  const maintenanceRef = collection(db, MAINTENANCE_COLLECTION)
  const q = query(maintenanceRef, orderBy('scheduledDate'))
  
  return onSnapshot(q, (snapshot) => {
    const schedules = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(schedules)
  }, (error) => {
    console.error('Error subscribing to maintenance:', error)
    callback([])
  })
}

// Get maintenance by ID
export const getMaintenanceById = async (id) => {
  try {
    const maintenanceRef = doc(db, MAINTENANCE_COLLECTION, id)
    const snapshot = await getDocs(collection(db, MAINTENANCE_COLLECTION))
    const maintenanceDoc = snapshot.docs.find(d => d.id === id)
    if (maintenanceDoc) {
      return { id: maintenanceDoc.id, ...maintenanceDoc.data() }
    }
    return null
  } catch (error) {
    console.error('Error fetching maintenance:', error)
    throw error
  }
}

// Add a new maintenance schedule
export const addMaintenanceSchedule = async (maintenanceData) => {
  try {
    const maintenanceRef = collection(db, MAINTENANCE_COLLECTION)
    const docRef = await addDoc(maintenanceRef, {
      ...maintenanceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding maintenance schedule:', error)
    throw error
  }
}

// Update a maintenance schedule
export const updateMaintenanceSchedule = async (id, maintenanceData) => {
  try {
    const maintenanceRef = doc(db, MAINTENANCE_COLLECTION, id)
    await updateDoc(maintenanceRef, {
      ...maintenanceData,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error updating maintenance schedule:', error)
    throw error
  }
}

// Delete a maintenance schedule
export const deleteMaintenanceSchedule = async (id) => {
  try {
    const maintenanceRef = doc(db, MAINTENANCE_COLLECTION, id)
    await deleteDoc(maintenanceRef)
  } catch (error) {
    console.error('Error deleting maintenance schedule:', error)
    throw error
  }
}

// Filter maintenance by type
export const getMaintenanceByType = async (type) => {
  try {
    const maintenanceRef = collection(db, MAINTENANCE_COLLECTION)
    const q = query(maintenanceRef, where('type', '==', type))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching maintenance by type:', error)
    throw error
  }
}

// Filter maintenance by status
export const getMaintenanceByStatus = async (status) => {
  try {
    const maintenanceRef = collection(db, MAINTENANCE_COLLECTION)
    const q = query(maintenanceRef, where('status', '==', status))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching maintenance by status:', error)
    throw error
  }
}



