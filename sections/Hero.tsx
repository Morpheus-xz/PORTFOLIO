
import React, { useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PixelSnow: React.FC = () => {
  const ref = useRef<THREE.Points>(null!);
  const [positions] = React.useState(() => {
    const pos = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  });

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.position.y -= delta * 0.15;
      if (ref.current.position.y < -5) ref.current.position.y = 5;
    }
  });

  return (
    <Points positions={positions} ref={ref}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.012}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const textRef = useRef<HTMLDivElement>(null!);
  const [backgroundReady, setBackgroundReady] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  // Performance: Pause heavy WebGL canvas when user scrolls past Hero
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '300px 0px', threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!backgroundReady) return;

    const ctx = gsap.context(() => {
      // Initial Reveal (Zoom In)
      gsap.from(".reveal-text", {
        scale: 0.8,
        y: 20,
        opacity: 0,
        duration: 2.0,
        stagger: 0.1,
        ease: "expo.out",
        delay: 0.1
      });

      // Parallax Effect
      gsap.to(textRef.current, {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // Premium Slide-Over Transition
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%", 
        pin: true,
        pinSpacing: false,
        pinType: "transform" // Critical: prevents position:fixed which destroys WebGL compositing on un-pin
      });
    }, containerRef);

    return () => ctx.revert();
  }, [backgroundReady]);

  return (
    <section id="home" ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className={`absolute inset-0 z-0 transition-opacity duration-700 will-change-transform ${backgroundReady ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas
          camera={{ position: [0, 0, 5] }}
          dpr={1}
          frameloop={isVisible ? 'always' : 'never'}
          onCreated={() => setBackgroundReady(true)}
        >
          <PixelSnow />
        </Canvas>
      </div>

      <div ref={textRef} className="relative z-10 text-center px-6 select-none pointer-events-none will-change-transform" style={{ visibility: backgroundReady ? 'visible' : 'hidden' }}>
        <div className="reveal-container mb-2 overflow-hidden">
          <h1 className="reveal-text font-syncopate text-5xl md:text-[10rem] font-bold leading-none tracking-tighter text-[#F5F5F5] uppercase">
            Vedansh Agarwal
          </h1>
        </div>
        <div className="reveal-container overflow-hidden">
          <p className="reveal-text text-[8px] md:text-sm tracking-[0.6em] text-white/40 uppercase font-light">
            Data Scientist | Machine Learning | Deep Learning | Gen-AI
          </p>
        </div>
      </div>

      <a
        href="/Vedansh_Agarwal_Resume.pdf"
        download
        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-auto inline-flex items-center rounded-full border border-[#B19EEF]/55 bg-[#B19EEF]/12 px-7 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5F5F5] transition-all duration-300 hover:scale-105 hover:border-[#B19EEF] hover:bg-[#B19EEF]/28 hover:shadow-[0_0_20px_rgba(177,158,239,0.32)] active:scale-95"
      >
        Download Resume
      </a>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 opacity-50">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <span className="text-[7px] tracking-[0.5em] text-white uppercase">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
