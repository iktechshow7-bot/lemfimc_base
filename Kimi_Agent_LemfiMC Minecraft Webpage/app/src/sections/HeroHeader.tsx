export default function HeroHeader() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, background: 'rgba(21, 18, 23, 0.5)' }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col items-center justify-center h-full px-6"
        style={{ zIndex: 2 }}
      >
        {/* Hero Title */}
        <h1
          className="font-pixel text-white text-center uppercase opacity-0-start animate-fade-slide-up"
          style={{
            fontSize: 'clamp(48px, 10vw, 96px)',
            letterSpacing: '4px',
            textShadow: '0 0 20px rgba(50, 205, 50, 0.5), 0 0 40px rgba(50, 205, 50, 0.3)',
          }}
        >
          LemfiMC
        </h1>

        {/* Tagline */}
        <p
          className="text-center opacity-0-start animate-fade-slide-up animation-delay-300"
          style={{
            fontSize: '20px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.8)',
            marginTop: '16px',
          }}
        >
          Minecraft Adventures, Builds & More
        </p>

        {/* Subscribe Button */}
        <a
          href="https://www.youtube.com/@LemfiMC"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white font-semibold no-underline transition-all duration-300 hover:opacity-85 hover:scale-[1.02] opacity-0-start animate-fade-slide-up animation-delay-600"
          style={{
            backgroundColor: '#F44336',
            fontSize: '16px',
            padding: '16px 32px',
            marginTop: '32px',
            borderRadius: '0px',
            cursor: 'pointer',
          }}
        >
          {/* Play Icon SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Subscribe on YouTube
        </a>
      </div>
    </section>
  )
}
