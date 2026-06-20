import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      navigate('/admin')
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid username or password')
      }

      localStorage.setItem('admin_token', data.token)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: '100vh', background: '#151217' }}
    >
      <div
        style={{
          border: '1px solid #32CD32',
          background: '#1A1A1A',
          padding: '48px',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '0px',
        }}
      >
        {/* Title */}
        <h1
          className="font-pixel text-center"
          style={{
            fontSize: '24px',
            color: '#32CD32',
            marginBottom: '32px',
          }}
        >
          Admin Login
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '8px',
              }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#2D2A33',
                border: '1px solid #1A1A1A',
                color: '#FFFFFF',
                fontSize: '14px',
                borderRadius: '0px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#32CD32'
                e.currentTarget.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#1A1A1A'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '8px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#2D2A33',
                border: '1px solid #1A1A1A',
                color: '#FFFFFF',
                fontSize: '14px',
                borderRadius: '0px',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#32CD32'
                e.currentTarget.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#1A1A1A'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="font-pixel w-full border-none cursor-pointer transition-opacity duration-300 hover:opacity-85"
            style={{
              background: '#32CD32',
              color: '#151217',
              fontSize: '12px',
              fontWeight: 700,
              padding: '16px',
              borderRadius: '0px',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p
            className="text-center"
            style={{
              color: '#F44336',
              fontSize: '14px',
              marginTop: '16px',
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
