import { useEffect, useState } from 'react'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
}

/**
 * Fetches the latest videos from the LemfiMC YouTube channel via RSS feed.
 *
 * CORS PROXY:
 * YouTube RSS feeds do not include CORS headers, so a proxy service is required
 * to fetch the feed from a browser. The default proxy is allorigins.win.
 * If this proxy stops working, replace the PROXY_URL constant below with
 * any alternative CORS proxy (e.g., https://corsproxy.io/?, https://api.codetabs.com/v1/proxy?quest=)
 *
 * RSS FEED URL:
 * https://www.youtube.com/feeds/videos.xml?channel_id=UCo5Ve--aWuXA6QSLpGi5WUw
 *
 * The feed returns Atom XML with media:group elements containing video metadata.
 * We parse the XML client-side using DOMParser and extract title, thumbnail,
 * publish date, and video URL for each entry.
 */
const PROXY_URL = 'https://api.allorigins.win/raw?url='
const RSS_URL =
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCo5Ve--aWuXA6QSLpGi5WUw'

function parseRSS(xmlText: string): Video[] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml')

  // Check for parsing errors
  const parserError = xmlDoc.querySelector('parsererror')
  if (parserError) {
    throw new Error('Failed to parse RSS XML')
  }

  const entries = xmlDoc.querySelectorAll('entry')
  const videos: Video[] = []

  entries.forEach((entry) => {
    // Get video ID from yt:videoId
    const videoId =
      entry.querySelector('videoId')?.textContent ||
      entry.querySelector('id')?.textContent?.split(':').pop() ||
      ''

    // Get title from media:group/media:title
    const title =
      entry.querySelector('title')?.textContent ||
      entry.querySelector('group title')?.textContent ||
      'Untitled Video'

    // Get thumbnail - use yt:videoId to construct high-quality thumbnail URL
    const thumbnail = videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : ''

    // Get publish date
    const publishedRaw = entry.querySelector('published')?.textContent || ''
    const publishedAt = publishedRaw
      ? new Date(publishedRaw).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : ''

    // Get video URL from link element
    const linkEl = entry.querySelector('link')
    const url = linkEl?.getAttribute('href') || `https://youtube.com/watch?v=${videoId}`

    if (videoId) {
      videos.push({
        id: videoId,
        title,
        thumbnail,
        publishedAt,
        url,
      })
    }
  })

  // Return only the latest 6 videos
  return videos.slice(0, 6)
}

export default function LatestVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(PROXY_URL + encodeURIComponent(RSS_URL))

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const xmlText = await response.text()
        const parsedVideos = parseRSS(xmlText)

        setVideos(parsedVideos)
      } catch (err) {
        console.error('Error fetching RSS feed:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load videos. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return (
    <section
      id="videos"
      className="w-full"
      style={{ padding: '80px 24px', background: '#151217' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Title */}
        <h2
          className="font-pixel"
          style={{
            fontSize: '28px',
            color: '#32CD32',
            marginBottom: '48px',
          }}
        >
          {/* Video Camera SVG Icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="#32CD32"
            style={{
              display: 'inline-block',
              marginRight: '12px',
              verticalAlign: 'middle',
            }}
          >
            <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" />
          </svg>
          Latest Videos
        </h2>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
          {loading && (
            <div
              className="flex items-center justify-center"
              style={{
                gridColumn: '1 / -1',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '16px',
                gap: '12px',
              }}
            >
              {/* Spinner SVG */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="animate-spin-slow"
              >
                <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" />
              </svg>
              Loading videos...
            </div>
          )}

          {error && (
            <div
              style={{
                gridColumn: '1 / -1',
                color: '#F44336',
                fontSize: '16px',
                textAlign: 'center',
              }}
            >
              Unable to load videos. Please try again later.
            </div>
          )}

          {!loading &&
            !error &&
            videos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block no-underline transition-all duration-300"
                style={{
                  border: '1px solid #32CD32',
                  background: '#1A1A1A',
                  overflow: 'hidden',
                  borderRadius: '0px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2196F3'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#32CD32'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Thumbnail */}
                <div
                  className="overflow-hidden"
                  style={{ aspectRatio: '16/9' }}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {video.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginTop: '8px',
                    }}
                  >
                    {video.publishedAt}
                  </p>
                </div>
              </a>
            ))}
        </div>
      </div>
    </section>
  )
}
