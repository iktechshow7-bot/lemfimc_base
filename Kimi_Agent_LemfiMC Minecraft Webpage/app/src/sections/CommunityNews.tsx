export default function CommunityNews() {
  return (
    <section
      id="community"
      className="w-full"
      style={{
        padding: '80px 24px',
        background: '#151217',
        borderTop: '2px solid #32CD32',
      }}
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
          {/* Pickaxe SVG Icon */}
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
            <path d="M4.5 2L2 4.5L6.5 9L4 11.5L6 13.5L8.5 11L13.5 16L12 17.5L14 19.5L15.5 18L17 19.5L19 17.5L15.5 14L20.5 9L22 7L19.5 4.5L18 6L13 1L11 3L12.5 4.5L4.5 2Z" />
          </svg>
          Community & News
        </h2>

        {/* Content Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: '24px' }}
        >
          {/* Wiki News Panel */}
          <div
            style={{
              border: '1px solid #32CD32',
              padding: '24px',
              background: '#1A1A1A',
              borderRadius: '0px',
            }}
          >
            {/* Panel Title */}
            <div className="flex items-center" style={{ marginBottom: '16px' }}>
              {/* Book SVG Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
                style={{ marginRight: '8px' }}
              >
                <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM6 4H11V12L8.5 10.5L6 12V4Z" />
              </svg>
              <h3
                className="font-pixel"
                style={{ fontSize: '16px', color: '#FFFFFF' }}
              >
                Minecraft Wiki
              </h3>
            </div>

            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '24px',
              }}
            >
              Stay up to date with the latest Minecraft updates, patch notes,
              and game changes.
            </p>

            <a
              href="https://minecraft.wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline transition-all duration-300 hover:underline"
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#32CD32',
              }}
            >
              Visit Minecraft Wiki &rarr;
            </a>
          </div>

          {/* Community Links Panel */}
          <div
            style={{
              border: '1px solid #32CD32',
              padding: '24px',
              background: '#1A1A1A',
              borderRadius: '0px',
            }}
          >
            {/* Panel Title */}
            <div className="flex items-center" style={{ marginBottom: '16px' }}>
              {/* People SVG Icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
                style={{ marginRight: '8px' }}
              >
                <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
              </svg>
              <h3
                className="font-pixel"
                style={{ fontSize: '16px', color: '#FFFFFF' }}
              >
                Join the Community
              </h3>
            </div>

            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '24px',
              }}
            >
              Connect with other Minecraft players, share builds, and get
              inspired.
            </p>

            <div className="flex flex-col" style={{ gap: '12px' }}>
              <a
                href="https://reddit.com/r/Minecraft"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline transition-all duration-300 hover:underline"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#32CD32',
                }}
              >
                r/Minecraft on Reddit
              </a>
              <a
                href="https://discord.gg/minecraft"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline transition-all duration-300 hover:underline"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#32CD32',
                }}
              >
                Minecraft Discord
              </a>
              <a
                href="https://minecraftforum.net"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline transition-all duration-300 hover:underline"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#32CD32',
                }}
              >
                Minecraft Forums
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
