export default function StickyFooter() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0"
      style={{
        zIndex: 100,
        background: 'linear-gradient(to top, #000 0%, #151217 100%)',
        borderTop: '2px solid #32CD32',
        padding: '16px 24px',
      }}
    >
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Left: Channel name + tagline */}
        <div className="flex flex-col md:flex-row items-center" style={{ gap: '12px' }}>
          <span
            className="font-pixel"
            style={{ fontSize: '14px', color: '#32CD32' }}
          >
            LemfiMC
          </span>
          <span
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Minecraft Adventures
          </span>
        </div>

        {/* Right: Nav Links */}
        <nav className="flex items-center" style={{ gap: '24px', listStyle: 'none' }}>
          <a
            href="https://www.youtube.com/@LemfiMC"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center transition-colors duration-300 hover:text-[#32CD32]"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
            }}
          >
            YouTube
            {/* External Link Icon */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginLeft: '4px' }}
            >
              <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z" />
            </svg>
          </a>
          <a
            href="#community"
            className="no-underline transition-colors duration-300 hover:text-[#32CD32]"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
            }}
          >
            Community
          </a>
          <a
            href="#videos"
            className="no-underline transition-colors duration-300 hover:text-[#32CD32]"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
            }}
          >
            Videos
          </a>
        </nav>
      </div>

      {/* Credit Line */}
      <div
        className="text-center"
        style={{
          marginTop: '8px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.4)',
        }}
      >
        Made with love for the Minecraft community
      </div>
    </footer>
  )
}
