import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  SiPython, SiPostgresql, SiPytorch, SiScikitlearn, SiFastapi, SiNumpy, SiPandas
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';

import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

const INCREMENT = 12345;
const MULTIPLIER = 1103515245;
const MODULUS = Math.pow(2, 31);

const SkillsSignalCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const inViewRef = useRef(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    let seed = 0;
    const random = {
      reset(newSeed: number) { seed = newSeed; },
      get() {
        seed = (MULTIPLIER * seed + INCREMENT) % MODULUS;
        return seed / MODULUS;
      }
    };

    const stepX = 16, stepY = 16, sizeX = 1.5, sizeY = 1.5, margin = 32;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${Math.floor(rect.width)}px`;
      canvas.style.height = `${Math.floor(rect.height)}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (frameTime: number) => {
      const targetFrameTime = inViewRef.current ? 1000 / 45 : 1000 / 14;
      if (frameTime - lastFrameRef.current < targetFrameTime) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      lastFrameRef.current = frameTime;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      context.globalCompositeOperation = 'source-over';
      context.fillStyle = 'rgba(5, 4, 10, 0.4)';
      context.fillRect(0, 0, width, height);

      context.globalCompositeOperation = 'screen';

      for (let y = margin; y < height - margin; y += stepY) {
        random.reset(y);
        for (let x = margin; x < width - margin; x += stepX) {
          const randomValue = random.get();
          const distX = randomValue * 16;
          const distY = randomValue * 16;
          const phase = randomValue * Math.PI * 2;

          if (randomValue > 0.95) {
            context.fillStyle = `rgba(177, 158, 239, ${0.4 + Math.sin(phase + frameTime / 800) * 0.4})`;
          } else if (randomValue > 0.8) {
            context.fillStyle = `rgba(3, 179, 195, ${0.2 + Math.cos(phase + frameTime / 1000) * 0.3})`;
          } else if (randomValue > 0.5) {
            context.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.sin(phase + frameTime / 1200) * 0.05})`;
          } else {
            continue;
          }

          context.fillRect(
            x,
            y,
            sizeX + Math.sin(phase + frameTime / 1000) * distX,
            sizeY + Math.cos(phase + frameTime / 1000) * distY
          );
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { rootMargin: '400px 0px' }
    );

    resizeObserver.observe(parent);
    visibilityObserver.observe(parent);
    resize();
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#05040a] to-black z-0" />
      <canvas ref={canvasRef} className="skills-signal-canvas absolute inset-0 z-10 w-full h-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_80%)] z-20" />
    </div>
  );
};

const skillData = [
  {
    category: 'Data Science',
    items: ['Exploratory Analysis', 'Statistical Reasoning', 'Data Preprocessing', 'Visual Storytelling']
  },
  {
    category: 'Machine Learning',
    items: ['Classification', 'Regression', 'Clustering', 'Feature Engineering', 'Model Validation']
  },
  {
    category: 'Deep Learning',
    items: [
      { name: 'CNN Architectures', icon: null, hex: '#ffffff' },
      { name: 'PyTorch', icon: SiPytorch, hex: '#EE4C2C' }
    ]
  },
  {
    category: 'Backend Systems',
    items: [
      { name: 'FastAPI Services', icon: SiFastapi, hex: '#009688' },
      'REST API Design'
    ]
  },
  {
    category: 'Core Stack',
    items: [
      { name: 'Python', icon: SiPython, hex: '#3776AB' },
      { name: 'Java', icon: FaJava, hex: '#007396' },
      { name: 'Pandas', icon: SiPandas, hex: '#150458' },
      { name: 'NumPy', icon: SiNumpy, hex: '#013243' },
      { name: 'Scikit-learn', icon: SiScikitlearn, hex: '#F7931E' },
      { name: 'PostgreSQL', icon: SiPostgresql, hex: '#336791' },
      { name: 'AWS', icon: FaAws, hex: '#FF9900' }
    ]
  }
];

const Skills: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {

      gsap.from('.skills-heading', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        y: 80,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
      });

      gsap.from('.skill-row', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 65%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });

      gsap.fromTo('.skills-entry-veil',
        { y: -64, opacity: 1, scaleY: 1.12 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'top 58%',
            scrub: 0.7
          },
          y: 0,
          opacity: 0.38,
          scaleY: 0.92,
          ease: 'none'
        }
      );

      gsap.fromTo('.skills-signal-canvas',
        { opacity: 0.24 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 92%',
            end: 'top 48%',
            scrub: 0.7
          },
          opacity: 0.82,
          ease: 'none'
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="skills" className="skills-section relative min-h-screen w-full bg-black py-24 md:py-32 px-4 md:px-12 overflow-hidden perspective-1000 flex flex-col items-center">

      {/* Background Layers */}
      <SkillsSignalCanvas />

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-black/40 to-black pointer-events-none opacity-80" />
      <div className="skills-entry-veil" aria-hidden="true" />
      <div className="skills-certifications-bridge" aria-hidden="true">
        <div className="skills-certifications-bridge__aura" />
        <div className="skills-certifications-bridge__line" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl mt-10 md:mt-20">

        {/* Massive Premium Typography Header */}
        <div className="skills-heading mb-16 md:mb-24 flex flex-col items-start w-full">
          <p className="mb-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.6em] text-[#03b3c3]/90">
            My Skills
          </p>
          <h2 className="font-syncopate text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Tech
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#B19EEF] to-[#03b3c3] opacity-90 text-4xl md:text-7xl">
              Stack
            </span>
          </h2>
          <p className="skills-heading-copy mt-7 max-w-2xl text-sm md:text-base font-light leading-relaxed text-white/58">
            A focused stack for building data-driven systems, model pipelines, and production-ready AI experiences.
          </p>
        </div>

        {/* Cinematic Unboxed Skill Rows */}
        <div className="flex flex-col w-full border-t border-white/[0.03]">
          {skillData.map((row, index) => (
            <div
              key={row.category}
              className="skill-row flex flex-col md:flex-row md:items-center py-8 md:py-12 border-b border-white/[0.03] group hover:bg-white/[0.01] transition-colors duration-700"
            >

              {/* Category (Left Side) */}
              <div className="md:w-1/3 flex items-center gap-4 md:gap-6 mb-6 md:mb-0 px-4 md:px-8">
                <span className="text-[#03b3c3]/40 font-mono text-xs md:text-sm tracking-widest transition-colors duration-500 group-hover:text-[#03b3c3]">
                  0{index + 1}
                </span>
                <h3 className="font-syncopate text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-[#B19EEF]/80 group-hover:text-white transition-all duration-500 drop-shadow-[0_0_15px_rgba(177,158,239,0)] group-hover:drop-shadow-[0_0_20px_rgba(177,158,239,0.5)]">
                  {row.category}
                </h3>
              </div>

              {/* Items (Right Side) */}
              <div className="md:w-2/3 flex flex-wrap items-center gap-x-2 md:gap-x-3 gap-y-2 md:gap-y-3 px-4 md:px-0">
                {row.items.map((item, i) => {
                  const isObj = typeof item !== 'string';
                  const name = isObj ? item.name : item;
                  const Icon = isObj ? (item.icon as any) : null;
                  const hex = isObj ? item.hex : '#ffffff';

                  return (
                    <div
                      key={name}
                      className="flex items-center gap-1.5 md:gap-2 group/item transition-all duration-500"
                    >
                      <span
                        className="flex items-center gap-2 font-inter text-base md:text-lg lg:text-xl font-light text-white/50 tracking-wide transition-all duration-300 cursor-default"
                        style={{ color: hex !== '#ffffff' ? 'currentColor' : '' }}
                        onMouseEnter={(e) => {
                          if (hex !== '#ffffff') {
                            e.currentTarget.style.color = hex;
                            e.currentTarget.style.textShadow = `0 0 20px ${hex}A0`;
                          } else {
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.textShadow = `0 0 15px rgba(255,255,255,0.8)`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '';
                          e.currentTarget.style.textShadow = '';
                        }}
                      >
                        {Icon && (
                          <Icon
                            className="text-lg md:text-xl transition-transform duration-500 group-hover/item:scale-110"
                            style={{ color: hex }}
                          />
                        )}
                        {name}
                      </span>

                      {/* Subdued bullet separator replacing the comma for a cleaner cinematic look */}
                      {i < row.items.length - 1 && (
                        <span className="text-white/10 mx-1 md:mx-2 text-xs md:text-sm select-none opacity-50 group-hover:opacity-100 transition-opacity">
                          •
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Skills;
