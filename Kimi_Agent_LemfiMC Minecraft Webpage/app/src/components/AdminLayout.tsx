import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface User {
  username: string
  role: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    // Verify token with backend
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token')
        return res.json()
      })
      .then((data) => {
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem('admin_token')
        navigate('/admin/login')
      })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          minHeight: '100vh',
          background: '#151217',
          color: '#32CD32',
          fontSize: '14px',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="animate-spin-slow"
          style={{ marginRight: '12px' }}
        >
          <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" />
        </svg>
        Loading...
      </div>
    )
  }

  if (!user) return null

  const navItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Content Editor', path: '/admin/content' },
    { label: 'Settings', path: '/admin/settings' },
  ]

  return (
    <div className="flex" style={{ minHeight: '100vh', background: '#151217' }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width: '240px',
          borderRight: '1px solid #32CD32',
          background: '#1A1A1A',
          padding: '24px',
        }}
      >
        {/* Logo */}
        <div
          className="font-pixel"
          style={{
            fontSize: '12px',
            color: '#32CD32',
            marginBottom: '32px',
          }}
        >
          LemfiMC Admin
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col" style={{ gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className="block no-underline transition-all duration-300"
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: isActive ? '#32CD32' : 'rgba(255, 255, 255, 0.7)',
                  background: isActive
                    ? 'rgba(50, 205, 50, 0.1)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #32CD32' : '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    e.currentTarget.style.color = '#FFFFFF'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                  }
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-transparent border-none cursor-pointer transition-opacity duration-300 hover:opacity-70"
          style={{
            fontSize: '14px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#F44336',
            textAlign: 'left',
            padding: '12px 16px',
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ padding: '32px' }}
      >
        {/* Mobile Nav */}
        <div className="md:hidden mb-6">
          <div
            className="font-pixel mb-4"
            style={{ fontSize: '12px', color: '#32CD32' }}
          >
            LemfiMC Admin
          </div>
          <div className="flex flex-wrap" style={{ gap: '8px' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="no-underline transition-all duration-300"
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: location.pathname === item.path ? '#32CD32' : 'rgba(255, 255, 255, 0.7)',
                  border: `1px solid ${location.pathname === item.path ? '#32CD32' : 'rgba(255, 255, 255, 0.2)'}`,
                }}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="bg-transparent border-none cursor-pointer"
              style={{
                padding: '8px 12px',
                fontSize: '12px',
                color: '#F44336',
                border: '1px solid rgba(244, 67, 54, 0.3)',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
