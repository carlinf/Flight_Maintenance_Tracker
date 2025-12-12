import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import FlightList from './components/FlightList'
import MaintenanceSchedule from './components/MaintenanceSchedule'
import AircraftStatus from './components/AircraftStatus'
import EthiopianAirlinesLogo from './components/EthiopianAirlinesLogo'
import UserMenu from './components/UserMenu'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { onAuthStateChange, logOut } from './firebase/services/authService'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentPage, setCurrentPage] = useState('login') // 'login', 'signup', 'dashboard'
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUser(user)
        setCurrentPage('dashboard')
      } else {
        setUser(null)
        setCurrentPage('login')
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleLogin = (userData) => {
    // User state is managed by Firebase auth state listener
    // This function is called after successful login/signup
    setCurrentPage('dashboard')
  }

  const handleLogout = async () => {
    try {
      await logOut()
      // Auth state listener will automatically update user state
      setActiveTab('dashboard')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  // Show login/signup pages
  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} onNavigateToSignUp={() => setCurrentPage('signup')} />
  }

  if (currentPage === 'signup') {
    return <SignUp onLogin={handleLogin} onNavigateToLogin={() => setCurrentPage('login')} />
  }

  // Show dashboard
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-brand">
              <EthiopianAirlinesLogo className="logo" />
            </div>
            <nav className="nav-tabs">
              <button 
                className={activeTab === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button 
                className={activeTab === 'flights' ? 'active' : ''}
                onClick={() => setActiveTab('flights')}
              >
                Flights
              </button>
              <button 
                className={activeTab === 'maintenance' ? 'active' : ''}
                onClick={() => setActiveTab('maintenance')}
              >
                Maintenance
              </button>
              <button 
                className={activeTab === 'aircraft' ? 'active' : ''}
                onClick={() => setActiveTab('aircraft')}
              >
                Aircraft Status
              </button>
            </nav>
          </div>
          <div className="header-right">
            <UserMenu 
              userName={user?.name || 'User'} 
              userEmail={user?.email}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'flights' && <FlightList />}
        {activeTab === 'maintenance' && <MaintenanceSchedule />}
        {activeTab === 'aircraft' && <AircraftStatus />}
      </main>
    </div>
  )
}

export default App
