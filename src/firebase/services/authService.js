import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../config'

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User's full name
 * @returns {Promise<Object>} User object with name and email
 */
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update the user's display name
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      })
    }

    return {
      uid: user.uid,
      name: displayName || user.displayName || email.split('@')[0],
      email: user.email
    }
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

/**
 * Sign in an existing user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object with name and email
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    return {
      uid: user.uid,
      name: user.displayName || email.split('@')[0],
      email: user.email
    }
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const logOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

/**
 * Get the current authenticated user
 * @returns {Object|null} User object or null if not authenticated
 */
export const getCurrentUser = () => {
  return auth.currentUser
}

/**
 * Subscribe to authentication state changes
 * @param {Function} callback - Callback function that receives user object or null
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email
      })
    } else {
      callback(null)
    }
  })
}


