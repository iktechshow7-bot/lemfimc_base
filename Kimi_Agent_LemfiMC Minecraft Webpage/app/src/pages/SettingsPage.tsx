import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

interface Settings {
  proxyUrl: string
}

const defaultSettings: Settings = {
  proxyUrl: 'https://api.allorigins.win/raw?url=',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load existing settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lemfimc_settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings((prev) => ({ ...prev, ...parsed }))
      } catch {
        // ignore parse errors
      }
    }
    setLoading(false)
  }, [])

  // Auto-dismiss success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)

    try {
      // In production: await fetch('/api/settings', { method: 'PUT', body: JSON.stringify(settings) })
      localStorage.setItem('lemfimc_settings', JSON.stringify(settings))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSuccess(true)
    } catch {
      // Error handling
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center" style={{ gap: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-spin-slow"
          >
            <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" />
          </svg>
          Loading settings...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Page Title */}
      <h1
        className="font-pixel"
        style={{ fontSize: '20px', color: '#32CD32', marginBottom: '32px' }}
      >
        Settings
      </h1>

      {/* Success Message */}
      {success && (
        <div
          style={{
            background: 'rgba(50, 205, 50, 0.1)',
            color: '#32CD32',
            padding: '12px 16px',
            border: '1px solid #32CD32',
            marginBottom: '24px',
            fontSize: '14px',
          }}
        >
          Settings saved successfully!
        </div>
      )}

      {/* RSS Proxy Config */}
      <div
        style={{
          border: '1px solid #32CD32',
          background: '#1A1A1A',
          padding: '24px',
          marginBottom: '24px',
          borderRadius: '0px',
        }}
      >
        <h2
          className="font-pixel"
          style={{ fontSize: '14px', color: '#FFFFFF', marginBottom: '24px' }}
        >
          RSS Proxy
        </h2>

        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '16px',
          }}
        >
          Configure the CORS proxy used to fetch the YouTube RSS feed. If the
          default proxy stops working, you can change it here.
        </p>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontFamily: "'Press Start 2P', cursive",
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '8px',
            }}
          >
            Proxy URL
          </label>
          <input
            type="text"
            value={settings.proxyUrl}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, proxyUrl: e.target.value }))
            }
            placeholder="https://api.allorigins.win/raw?url="
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
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.4)',
              marginTop: '8px',
            }}
          >
            The proxy URL will be prepended to the YouTube RSS feed URL.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="font-pixel border-none cursor-pointer transition-opacity duration-300 hover:opacity-85"
        style={{
          background: '#32CD32',
          color: '#151217',
          fontSize: '12px',
          fontWeight: 700,
          padding: '16px 32px',
          borderRadius: '0px',
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </AdminLayout>
  )
}
