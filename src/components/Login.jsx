import { useState } from 'react'
import './Auth.css'
import { signIn } from '../firebase/services/authService'

const Login = ({ onLogin, onNavigateToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      // Sign in with Firebase
      const user = await signIn(formData.email, formData.password)
      
      if (onLogin) {
        onLogin(user)
      }
    } catch (err) {
      console.error('Login error:', err)
      // Handle specific Firebase errors
      let errorMessage = 'Invalid email or password. Please try again.'
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.'
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.'
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
          <h2>Welcome Back</h2>
          <p>Sign in to your maintenance dashboard</p>
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
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@ethiopianairlines.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Password reset feature coming soon!'); }}>Forgot password?</a>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <button 
            type="button"
            className="auth-link-button"
            onClick={() => {
              if (window.location.pathname.includes('signup') || window.location.pathname.includes('sign-up')) {
                // If using routing, navigate
              } else {
                // For state-based navigation, trigger parent
                if (onNavigateToSignUp) {
                  onNavigateToSignUp()
                }
              }
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

