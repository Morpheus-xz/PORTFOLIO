import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

const PixelBlast = React.lazy(() => import('../components/PixelBlast'));

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const loadEngine = true;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Setup scroll trigger for the text elements in the about section
      gsap.from(".about-reveal", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
      });

      gsap.to(".about-photo-frame", {
        y: -8,
        rotateZ: 0.6,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden py-24 px-6 md:px-12"
    >
      <div className={`transition-opacity duration-1000 will-change-transform ${loadEngine ? 'opacity-100' : 'opacity-0'}`} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        {loadEngine && (
          <React.Suspense fallback={null}>
            <PixelBlast
              variant="square"
              pixelSize={4}
              color="#B19EEF"
              patternScale={2}
              patternDensity={1}
              pixelSizeJitter={0}
              enableRipples={true}
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid={false}
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.5}
              edgeFade={0.25}
              transparent={true}
            />
          </React.Suspense>
        )}
      </div>

      <div className="about-skills-bridge" aria-hidden="true">
        <div className="about-skills-bridge__aura" />
        <div className="about-skills-bridge__line" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

        {/* Profile Image Container */}
        <div className="md:col-span-5 flex justify-center about-reveal relative h-[44vh] md:h-[74vh] z-30 pointer-events-auto">
          <div className="about-photo-frame relative h-full w-full max-w-[300px] md:max-w-[350px]">
            <div className="absolute -inset-5 rounded-[2.2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(177,158,239,0.26),transparent_65%),radial-gradient(circle_at_75%_80%,rgba(3,179,195,0.18),transparent_70%)] blur-2xl opacity-80" />
            <div className="relative h-full rounded-[1.8rem] border border-white/12 bg-gradient-to-b from-[#141024]/90 to-[#05050a]/95 p-2.5 shadow-[0_24px_72px_rgba(0,0,0,0.62)] transition-transform duration-500 hover:scale-[1.015]">
              <div className="h-full overflow-hidden rounded-[1.45rem] border border-white/10 bg-black">
                <img
                  src="/profile.jpg"
                  alt="Vedansh Agarwal"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-7 relative z-20 flex flex-col items-center md:items-start text-center md:text-left about-reveal">

          <div className="overflow-hidden mb-6 w-full">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-syncopate font-bold leading-tight tracking-tighter text-[#F5F5F5] uppercase drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              About <span className="text-white/40">Me</span>
            </h2>
          </div>

          <div className="w-16 h-[1px] bg-gradient-to-r from-[#B19EEF] to-transparent mb-8" />

          <p className="text-base md:text-lg text-white/90 font-light leading-relaxed mb-6 font-sans drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            I’m Vedansh Agarwal, an AI-focused Computer Science undergraduate passionate about building intelligent systems that solve real-world problems. From machine learning pipelines and LLM-powered applications to backend APIs and deep learning models, I love creating projects that are both technically strong and practically useful.
          </p>

          <p className="text-base md:text-lg text-white/90 font-light leading-relaxed font-sans drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            I work mainly with Java, Python, FastAPI, React, PyTorch, Scikit-learn, Supabase, and AWS, and I’m especially interested in applied AI, data-driven systems, and product-oriented engineering. I’m constantly learning, building, and pushing myself to become a better engineer every day.
          </p>

          <div className="mt-12">
            <button
              onClick={() => {
                const lenis = (window as any).lenis;
                if (lenis) {
                  lenis.scrollTo('#contact', { duration: 1.8, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                } else {
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-block px-10 py-4 rounded-full border border-[#B19EEF]/50 bg-[#B19EEF]/10 text-[#F5F5F5] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B19EEF]/30 hover:border-[#B19EEF] hover:scale-105 hover:shadow-[0_0_20px_rgba(177,158,239,0.3)] transition-all duration-300 active:scale-95 drop-shadow-xl"
            >
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
