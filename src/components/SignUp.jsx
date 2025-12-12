import { useState } from 'react'
import './Auth.css'
import { signUp } from '../firebase/services/authService'

const SignUp = ({ onLogin, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.department) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      // Sign up with Firebase
      const user = await signUp(formData.email, formData.password, formData.name)
      
      if (onLogin) {
        onLogin(user)
      }
    } catch (err) {
      console.error('Signup error:', err)
      // Handle specific Firebase errors
      let errorMessage = 'Failed to create account. Please try again.'
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.'
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.'
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img 
              src="/ethiopian-airlines-logo.jpg" 
              alt="Ethiopian Airlines Logo" 
              className="auth-logo-image"
            />
          </div>
          <h2>Create Account</h2>
          <p>Join the maintenance management system</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@ethiopianairlines.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="maintenance">Maintenance</option>
              <option value="operations">Operations</option>
              <option value="engineering">Engineering</option>
              <option value="management">Management</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              autoComplete="new-password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the terms and conditions</span>
            </label>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <button 
            type="button"
            className="auth-link-button"
            onClick={() => {
              if (onNavigateToLogin) {
                onNavigateToLogin()
              }
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp

