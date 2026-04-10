
import React, { useEffect, useRef } from 'react';
import { ExternalLink, Terminal, Image as ImageIcon } from 'lucide-react';
import './Projects.css';

const FaultyTerminal = React.lazy(() => import('../components/FaultyTerminal'));

const projects = [
  {
    title: "SENTINEL.AI",
    heading: "Privacy-First Code Security Analysis",
    description: "SENTINEL.AI is a locally-run code security analysis system to detect vulnerable coding patterns without exposing source code. Combines AST-based taint tracking with CodeBERT to identify command injection, unsafe execution, and hardcoded secrets.",
    techStack: ["Python", "FastAPI", "React", "AST", "CodeBERT"],
    link: "https://sentinelai-peach.vercel.app/",
    image: "/sentinel.jpg"
  },
  {
    title: "ONTRACK",
    heading: "AI Career Intelligence Platform",
    description: "OnTrack uses LLM-driven reasoning and a robust backend to discover suitable career paths and generate structured learning roadmaps based on user skills. Strong focus on response accuracy and real-world usability.",
    techStack: ["Python", "FastAPI", "React", "Supabase", "PostgreSQL"],
    link: "https://ontrack-mu-ten.vercel.app",
    image: "/ontrack.jpg"
  },
  {
    title: "AEROSTORM",
    heading: "AI Cyclone Telemetry & Assessment",
    description: "A deep learning project assessing cyclone intensity and danger levels using infrared satellite imagery. Leverages a multi-task CNN for risk classification and regression, incorporating pseudo-labeling for limited data.",
    techStack: ["Python", "PyTorch", "NumPy", "Scikit-learn", "Streamlit"],
    link: "https://aerostorm.streamlit.app",
    image: "/aerostorm.jpg"
  }
];

const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadEngine, setLoadEngine] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    let timer: number | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        timer = window.setTimeout(() => setLoadEngine(true), 200);
        observer.disconnect();
      },
      { rootMargin: '300px' }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  // Performance: Pause heavy WebGL canvas when user scrolls past Projects
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '300px 0px', threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="projects-section relative w-full flex flex-col items-center py-24 md:py-32 overflow-hidden bg-black"
    >
      {/* Heavy WebGL Background */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 will-change-transform pointer-events-none ${loadEngine ? 'opacity-72' : 'opacity-0'}`}>
        {loadEngine && (
          <React.Suspense fallback={null}>
            <FaultyTerminal
              scale={2.1}
              dpr={1}
              gridMul={[2, 1]}
              digitSize={1.2}
              timeScale={0.5}
              pause={!isVisible}
              scanlineIntensity={0.5}
              glitchAmount={1}
              flickerAmount={1}
              noiseAmp={1}
              chromaticAberration={0}
              dither={0}
              curvature={0.1}
              tint="#ffffff"
              mouseReact
              mouseStrength={2}
              pageLoadAnimation
              brightness={0.6}
            />
          </React.Suspense>
        )}
      </div>
      <div className="projects-surface" aria-hidden="true" />
      <div className="projects-entry-veil" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-[90rem] px-6 md:px-12 flex flex-col pt-12 items-center">

        {/* Centered Header */}
        <div className="projects-header flex flex-col items-center text-center w-full mb-12 md:mb-16">
          <p className="mb-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.55em] text-[#03b3c3]/90">
            Selected Work
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-syncopate font-black tracking-tighter mb-4 text-white drop-shadow-[0_0_20px_rgba(0,0,0,1)] uppercase">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B19EEF] to-[#03b3c3]">Projects</span>
          </h2>
          <div className="h-px w-40 bg-gradient-to-r from-[#B19EEF]/80 via-[#03b3c3]/40 to-transparent mb-7" />
          <p className="projects-header-copy text-white/78 text-sm md:text-base font-light tracking-wide max-w-2xl leading-relaxed">
            Production-minded systems shaped around applied AI, strong backend foundations, and real-world usability.
          </p>
        </div>

        {/* Compact 3-Column Grid */}
        <div className="projects-grid w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-24">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="project-card group relative w-full flex flex-col rounded-2xl border border-white/12 bg-[#050508]/96 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.72)] overflow-hidden transition-all duration-500 hover:border-[#B19EEF]/32 hover:shadow-[0_0_28px_rgba(177,158,239,0.1)] hover:-translate-y-1 z-10"
            >
              {/* Image Header (Top Section) */}
              <div className="project-image-wrap w-full relative h-[200px] sm:h-[240px] overflow-hidden border-b border-white/10 bg-[#0A0A0F]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-700 ease-out opacity-72 group-hover:opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />

                {/* Fallback missing image graphic */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/10 z-0 pointer-events-none">
                  <ImageIcon size={48} strokeWidth={0.5} />
                  <span className="font-mono uppercase tracking-[0.3em] text-[10px]">Image Output</span>
                </div>

                {/* Fade into the lower dark section */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050508] to-transparent pointer-events-none z-10" />
              </div>

              {/* Content Body (Bottom Section) */}
              <div className="project-body w-full p-6 md:p-8 flex flex-col flex-1 relative z-20 bg-[#050508]/94">
                <div className="project-meta flex items-center gap-2 mb-4">
                  <Terminal size={14} className="text-[#03b3c3]" />
                  <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#B19EEF]">
                    System 0{idx + 1}
                  </span>
                </div>

                <h3 className="project-title text-2xl md:text-3xl font-syncopate font-bold tracking-tight text-white mb-2 uppercase break-words w-full transition-all duration-300">
                  {project.title}
                </h3>

                <h4 className="project-heading text-sm md:text-base text-[#03b3c3] font-medium mb-4 tracking-wide min-h-[2.5rem] line-clamp-2">
                  {project.heading}
                </h4>

                <p className="project-description text-white/78 font-light leading-relaxed mb-6 text-xs md:text-sm flex-1">
                  {project.description}
                </p>

                <div className="project-footer mt-auto flex flex-col gap-5">
                  {/* Tech Stack Chips */}
                  <div className="project-tech flex flex-wrap gap-2 pt-1 border-t border-white/6">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-black/80 border border-white/10 text-[9px] sm:text-[10px] font-mono text-white/62 tracking-[0.18em] uppercase rounded hover:border-white/24 hover:text-white transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group/btn"
                  >
                    <span className="font-bold text-[10px] md:text-xs tracking-widest uppercase">
                      View Project
                    </span>
                    <ExternalLink size={14} strokeWidth={2.5} className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
