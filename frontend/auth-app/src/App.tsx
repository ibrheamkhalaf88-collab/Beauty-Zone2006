import { useState } from 'react'
import LoginPage from './components/login/LoginPage'
import DashboardPage from './components/dashboard/DashboardPage'

export type View = 'login' | 'dashboard'

export interface User {
  name: string
  email?: string
}

function App() {
  const [view, setView] = useState<View>('login')
  const [user, setUser] = useState<User | null>(null)

  return (
    <div className="min-h-screen bg-bg-warm font-body text-text-dark">
      {view === 'login' ? (
        <LoginPage onLogin={(userData: User) => { setUser(userData); setView('dashboard') }} />
      ) : (
        <DashboardPage user={user} onLogout={() => { setUser(null); setView('login') }} />
      )}
    </div>
  )
}

export default App
