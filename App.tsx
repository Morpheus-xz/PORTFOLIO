
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Certifications from './sections/Certifications';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [appVisible, setAppVisible] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const handleRevealApp = useCallback(() => setAppVisible(true), []);
  const handleLoaderComplete = useCallback(() => setShowLoader(false), []);

  useEffect(() => {
    // 1. Clear scroll memory on mount
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Initialize Lenis
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.08,
      touchMultiplier: 1.6,
      infinite: false,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    // 3. Keep GSAP from catch-up bursts after dropped frames (prevents jumpy scroll)
    gsap.ticker.lagSmoothing(0);

    // 4. Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // 5. Drive Lenis with a dedicated RAF loop for steadier frame pacing
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    // 6. Global ScrollTrigger defaults
    ScrollTrigger.defaults({
      scroller: window,
    });
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      (window as any).lenis = null;
    };
  }, []);

  // Handle ScrollTrigger refreshing after loading and on resize
  useEffect(() => {
    if (appVisible) {
      // Refresh ScrollTrigger after a short delay to ensure DOM is ready
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      // GSAP automatically handles native window resize events. A continuous 
      // ResizeObserver on document.body triggers heavy layout thrashing causing lag.

      return () => {
        clearTimeout(timer);
      };
    }
  }, [appVisible]);

  return (
    <main className="bg-black text-[#F5F5F5] selection:bg-[#2D1B4E] selection:text-white min-h-screen antialiased">
      {showLoader && (
        <Loader
          onRevealApp={handleRevealApp}
          onComplete={handleLoaderComplete}
        />
      )}

      <div
        className={`relative z-10 w-full transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          !appVisible
            ? 'opacity-0 pointer-events-none scale-[1.045] blur-[2px]'
            : 'opacity-100 scale-100 blur-0'
        }`}
        aria-hidden={!appVisible}
      >
        <Navbar />
        <div id="smooth-wrapper">
          <Hero />
          <About />
          <Skills />
          <Certifications />
          <Projects />
          <Contact />
        </div>
      </div>
    </main>
  );
};

export default App;
