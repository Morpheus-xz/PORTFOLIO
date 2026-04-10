
import React from 'react';
import ProfileCard from '../components/ProfileCard';

const GhostCursor = React.lazy(() => import('../components/GhostCursor'));

const Contact: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [loadCursor, setLoadCursor] = React.useState(false);
  const isSafari = React.useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    return /Safari/i.test(ua) && !/Chrome|CriOS|Edg|OPR|FxiOS/i.test(ua);
  }, []);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoadCursor(true);
        observer.disconnect();
      },
      { rootMargin: '300px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {loadCursor && (
        <React.Suspense fallback={null}>
          <GhostCursor 
            color="#B19EEF"
            brightness={isSafari ? 0.72 : 0.9}
            trailLength={50}
            inertia={0.5}
            bloomStrength={isSafari ? 0.022 : 0.045}
            bloomRadius={isSafari ? 0.45 : 0.65}
            bloomThreshold={isSafari ? 0.2 : 0.14}
            fadeDelayMs={1000}
            fadeDurationMs={1500}
            zIndex={1}
            edgeIntensity={isSafari ? 0.1 : 0.15}
            grainIntensity={isSafari ? 0.008 : 0.015}
            maxDevicePixelRatio={isSafari ? 0.4 : 0.5}
          />
        </React.Suspense>
      )}
      
      <div className="relative z-10 w-full max-w-6xl px-4 flex flex-col md:flex-row items-center justify-around gap-12 py-20">
        <div className="relative z-30 max-w-md rounded-2xl border border-white/10 bg-black/35 px-6 py-7 text-center md:text-left pointer-events-auto backdrop-blur-md shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6">
            Let's Make <span className="text-white/70">Magic.</span>
          </h2>
          <p className="text-lg text-white/75 font-light leading-relaxed mb-10">
            Available for freelance, full-time positions, or just to chat about the latest in AI and Design.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 mt-4">
            <a
              href="https://github.com/Morpheus-xz"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto relative z-40 rounded-md border border-transparent px-3 py-1 text-xs uppercase tracking-widest text-[#CFC0FF] opacity-85 transition-all duration-300 hover:border-[#B19EEF]/60 hover:bg-[#B19EEF]/25 hover:text-white hover:opacity-100 hover:shadow-[0_0_24px_rgba(177,158,239,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B19EEF]/70"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/vedanshagarwal9821"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto relative z-40 rounded-md border border-transparent px-3 py-1 text-xs uppercase tracking-widest text-[#CFC0FF] opacity-85 transition-all duration-300 hover:border-[#B19EEF]/60 hover:bg-[#B19EEF]/25 hover:text-white hover:opacity-100 hover:shadow-[0_0_24px_rgba(177,158,239,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B19EEF]/70"
            >
              LinkedIn
            </a>
            <a
              href="mailto:vedanshagarwaldpr1234@gmail.com"
              className="pointer-events-auto relative z-40 rounded-md border border-transparent px-3 py-1 text-xs uppercase tracking-widest text-[#CFC0FF] opacity-85 transition-all duration-300 hover:border-[#B19EEF]/60 hover:bg-[#B19EEF]/25 hover:text-white hover:opacity-100 hover:shadow-[0_0_24px_rgba(177,158,239,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B19EEF]/70"
            >
              Email
            </a>
            <a
              href="/Vedansh_Agarwal_Resume.pdf"
              download
              className="pointer-events-auto relative z-40 rounded-md border border-transparent px-3 py-1 text-xs uppercase tracking-widest text-[#CFC0FF] opacity-85 transition-all duration-300 hover:border-[#B19EEF]/60 hover:bg-[#B19EEF]/25 hover:text-white hover:opacity-100 hover:shadow-[0_0_24px_rgba(177,158,239,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B19EEF]/70"
            >
              Resume
            </a>
          </div>
        </div>

        <div className="relative z-20 pointer-events-auto">
          <ProfileCard 
            onContactClick={() => window.open('mailto:hello@vedansh.dev')}
            behindGlowColor="rgba(177, 158, 239, 0.2)"
            innerGradient="linear-gradient(145deg, #0a0a0a 0%, #2D1B4E 100%)"
            enableTilt={false}
          />
        </div>
      </div>

      <footer className="absolute bottom-8 left-0 right-0 text-center text-[11px] md:text-xs uppercase tracking-[0.28em] text-white/75 opacity-80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] pointer-events-none">
        &copy; 2026 Vedansh Agarwal — Designed & Developed by Vedansh Agarwal
      </footer>
    </section>
  );
};

export default Contact;
