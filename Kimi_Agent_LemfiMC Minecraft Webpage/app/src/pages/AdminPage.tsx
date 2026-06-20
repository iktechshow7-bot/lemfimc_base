import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

interface Stats {
  videoCount: number
  proxyStatus: string
  lastUpdated: string
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<Stats>({
    videoCount: 0,
    proxyStatus: 'Unknown',
    lastUpdated: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Try to fetch RSS to check proxy status and video count
        const proxyUrl = 'https://api.allorigins.win/raw?url='
        const rssUrl =
          'https://www.youtube.com/feeds/videos.xml?channel_id=UCo5Ve--aWuXA6QSLpGi5WUw'

        const response = await fetch(proxyUrl + encodeURIComponent(rssUrl), {
          method: 'GET',
        })

        let videoCount = 0
        let proxyStatus = 'Inactive'

        if (response.ok) {
          const xmlText = await response.text()
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(xmlText, 'application/xml')
          const entries = xmlDoc.querySelectorAll('entry')
          videoCount = Math.min(entries.length, 6)
          proxyStatus = 'Active'
        }

        setStats({
          videoCount,
          proxyStatus,
          lastUpdated: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        })
      } catch {
        setStats((prev) => ({
          ...prev,
          proxyStatus: 'Inactive',
          lastUpdated: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }))
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleTestRSS = async () => {
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url='
      const rssUrl =
        'https://www.youtube.com/feeds/videos.xml?channel_id=UCo5Ve--aWuXA6QSLpGi5WUw'
      const response = await fetch(proxyUrl + encodeURIComponent(rssUrl))
      if (response.ok) {
        alert('RSS feed fetched successfully!')
      } else {
        alert('Failed to fetch RSS feed. Status: ' + response.status)
      }
    } catch {
      alert('Error fetching RSS feed. Check console for details.')
    }
  }

  const handleClearCache = () => {
    // In a real app, this would clear server-side cache
    // For now, just reload the page
    window.location.reload()
  }

  return (
    <AdminLayout>
      {/* Page Title */}
      <h1
        className="font-pixel"
        style={{ fontSize: '20px', color: '#32CD32', marginBottom: '32px' }}
      >
        Dashboard
      </h1>

      {/* Stats Cards */}
      {loading ? (
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
          Loading stats...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px' }}>
          {/* Total Videos */}
          <div
            style={{
              border: '1px solid #32CD32',
              background: '#1A1A1A',
              padding: '24px',
              borderRadius: '0px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
              }}
            >
              Total Videos
            </div>
            <div
              className="font-pixel"
              style={{ fontSize: '20px', color: '#FFFFFF', marginTop: '8px' }}
            >
              {stats.videoCount}
            </div>
          </div>

          {/* RSS Proxy Status */}
          <div
            style={{
              border: '1px solid #32CD32',
              background: '#1A1A1A',
              padding: '24px',
              borderRadius: '0px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
              }}
            >
              RSS Proxy Status
            </div>
            <div
              className="font-pixel"
              style={{
                fontSize: '20px',
                marginTop: '8px',
                color: stats.proxyStatus === 'Active' ? '#32CD32' : '#F44336',
              }}
            >
              {stats.proxyStatus}
            </div>
          </div>

          {/* Last Updated */}
          <div
            style={{
              border: '1px solid #32CD32',
              background: '#1A1A1A',
              padding: '24px',
              borderRadius: '0px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
              }}
            >
              Last Updated
            </div>
            <div
              className="font-pixel"
              style={{ fontSize: '14px', color: '#FFFFFF', marginTop: '8px' }}
            >
              {stats.lastUpdated}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: '48px' }}>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#FFFFFF',
            marginBottom: '16px',
          }}
        >
          Quick Actions
        </h2>
        <div className="flex flex-wrap" style={{ gap: '12px' }}>
          <button
            onClick={() => navigate('/admin/content')}
            className="cursor-pointer transition-all duration-300 font-semibold"
            style={{
              padding: '12px 24px',
              border: '1px solid #32CD32',
              background: 'transparent',
              color: '#32CD32',
              fontSize: '14px',
              borderRadius: '0px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#32CD32'
              e.currentTarget.style.color = '#151217'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#32CD32'
            }}
          >
            Edit Content
          </button>
          <button
            onClick={handleTestRSS}
            className="cursor-pointer transition-all duration-300 font-semibold"
            style={{
              padding: '12px 24px',
              border: '1px solid #32CD32',
              background: 'transparent',
              color: '#32CD32',
              fontSize: '14px',
              borderRadius: '0px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#32CD32'
              e.currentTarget.style.color = '#151217'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#32CD32'
            }}
          >
            Test RSS Feed
          </button>
          <button
            onClick={handleClearCache}
            className="cursor-pointer transition-all duration-300 font-semibold"
            style={{
              padding: '12px 24px',
              border: '1px solid #32CD32',
              background: 'transparent',
              color: '#32CD32',
              fontSize: '14px',
              borderRadius: '0px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#32CD32'
              e.currentTarget.style.color = '#151217'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#32CD32'
            }}
          >
            Clear Cache
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
