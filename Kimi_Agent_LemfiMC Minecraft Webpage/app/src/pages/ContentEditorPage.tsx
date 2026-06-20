import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

interface ContentForm {
  heroTagline: string
  wikiUrl: string
  redditUrl: string
  discordUrl: string
  forumUrl: string
  creditText: string
}

const defaultContent: ContentForm = {
  heroTagline: 'Minecraft Adventures, Builds & More',
  wikiUrl: 'https://minecraft.wiki',
  redditUrl: 'https://reddit.com/r/Minecraft',
  discordUrl: 'https://discord.gg/minecraft',
  forumUrl: 'https://minecraftforum.net',
  creditText: 'Made with love for the Minecraft community',
}

export default function ContentEditorPage() {
  const [content, setContent] = useState<ContentForm>(defaultContent)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load existing content from localStorage (or API in production)
  useEffect(() => {
    const saved = localStorage.getItem('lemfimc_content')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setContent((prev) => ({ ...prev, ...parsed }))
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

  const handleChange = (field: keyof ContentForm, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)

    try {
      // In production, this would be: await fetch('/api/content', { method: 'PUT', ... })
      // For now, save to localStorage as a demo
      localStorage.setItem('lemfimc_content', JSON.stringify(content))

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSuccess(true)
    } catch {
      // Error handling would go here
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: '#2D2A33',
    border: '1px solid #1A1A1A',
    color: '#FFFFFF',
    fontSize: '14px',
    borderRadius: '0px',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block' as const,
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '8px',
    fontFamily: "'Press Start 2P', cursive",
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
          Loading content...
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
        Content Editor
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
          Changes saved successfully!
        </div>
      )}

      {/* Hero Section */}
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
          Hero Section
        </h2>

        <div>
          <label style={labelStyle}>Tagline Text</label>
          <textarea
            rows={2}
            value={content.heroTagline}
            onChange={(e) => handleChange('heroTagline', e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#32CD32'
              e.currentTarget.style.outline = 'none'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#1A1A1A'
            }}
          />
        </div>
      </div>

      {/* Community Section */}
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
          Community Section
        </h2>

        <div className="flex flex-col" style={{ gap: '16px' }}>
          <div>
            <label style={labelStyle}>Minecraft Wiki URL</label>
            <input
              type="text"
              value={content.wikiUrl}
              onChange={(e) => handleChange('wikiUrl', e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#32CD32'
                e.currentTarget.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#1A1A1A'
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>Reddit URL</label>
            <input
              type="text"
              value={content.redditUrl}
              onChange={(e) => handleChange('redditUrl', e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#32CD32'
                e.currentTarget.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#1A1A1A'
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>Discord URL</label>
            <input
              type="text"
              value={content.discordUrl}
              onChange={(e) => handleChange('discordUrl', e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#32CD32'
                e.currentTarget.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#1A1A1A'
              }}
            />
          </div>

          <div>
            <label style={labelStyle}>Forum URL</label>
            <input
              type="text"
              value={content.forumUrl}
              onChange={(e) => handleChange('forumUrl', e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#32CD32'
                e.currentTarget.style.outline = 'none'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#1A1A1A'
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
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
          Footer Section
        </h2>

        <div>
          <label style={labelStyle}>Credit Line</label>
          <input
            type="text"
            value={content.creditText}
            onChange={(e) => handleChange('creditText', e.target.value)}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#32CD32'
              e.currentTarget.style.outline = 'none'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#1A1A1A'
            }}
          />
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
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </AdminLayout>
  )
}
