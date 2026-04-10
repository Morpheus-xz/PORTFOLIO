import React, { useState } from 'react';
import { FileBadge, Info, ExternalLink, ShieldCheck } from 'lucide-react';
import Beams from '../components/Beams';
import './Certifications.css';

const certifications = [
  {
    title: "Best Coder (Data Structures & Algorithms)",
    issuer: "KIET Group of Institutions (Dept. of CSE-AI/AI&ML)",
    date: "October 2025",
    image: "/cert-kiet-best-coder.jpg",
    credentialUrl: "",
    verificationUrl: ""
  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "Dec 2025 - Dec 2028",
    image: "/aws-cert.jpg",
    credentialUrl: "https://www.credly.com/badges/1323b061-3722-457a-890f-6fb707f76190/public_url",
    verificationUrl: "https://cp.certmetrics.com/amazon/en/public/verify/credential/fbddb43c7d79400ca3212778c9b0f951"
  },
  {
    title: "Deep Learning: Beginner to Advanced",
    issuer: "Codebasics",
    date: "Feb 2026",
    image: "/cert-dl-codebasics.jpg",
    credentialUrl: "",
    verificationUrl: "https://codebasics.io/certificate/CB-85-540098"
  },
  {
    title: "Intermediate Machine Learning",
    issuer: "Kaggle",
    date: "Jan 2026",
    image: "/cert-kaggle-ml.jpg",
    credentialUrl: "",
    verificationUrl: "https://www.kaggle.com/learn/certification/vedanshagarwal2007/intermediate-machine-learning"
  },
  {
    title: "Master Machine Learning for Data Science",
    issuer: "Codebasics",
    date: "Jan 2026",
    image: "/cert-ml-codebasics.jpg",
    credentialUrl: "",
    verificationUrl: "https://codebasics.io/certificate/CB-69-540098"
  },
  {
    title: "Python: Beginner to Advanced For Data Professionals",
    issuer: "Codebasics",
    date: "Jan 2025",
    image: "/cert-python-codebasics.jpg",
    credentialUrl: "",
    verificationUrl: "https://codebasics.io/certificate/CB-48-540098"
  }
];

const Certifications: React.FC = () => {
  const [activeInfo, setActiveInfo] = useState<number | null>(null);

  // Removed GSAP entrance animations because ScrollTrigger fails to calculate 
  // intersecting triggers predictably alongside Lenis smooth scrolling, trapping elements at Opacity 0.

  return (
    <section id="certifications" className="certifications-section relative min-h-screen w-full bg-black py-24 md:py-32 overflow-hidden flex flex-col items-center">
      {/* Background WebGL Component */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80" style={{ mixBlendMode: 'screen' }}>
        <Beams
          beamWidth={5}
          beamHeight={30}
          beamNumber={24}
          lightColor="#B19EEF"
          speed={2.5}
          noiseIntensity={1.8}
          scale={0.25}
          rotation={35}
        />
        {/* Subtle fade overlay to ground the absolute darkness */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black via-transparent to-black pointer-events-none opacity-90" />
      </div>
      <div className="certifications-entry-veil" aria-hidden="true" />
      <div className="certifications-projects-bridge" aria-hidden="true">
        <div className="certifications-projects-bridge__aura" />
        <div className="certifications-projects-bridge__line" />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col items-center md:items-start text-center md:text-left cert-heading">
        <p className="mb-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.55em] text-[#03b3c3]/90">
          Certifications
        </p>
        <h2 className="font-syncopate text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] mb-4">
          Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B19EEF] to-[#03b3c3]">Credentials</span>
        </h2>
        <div className="h-px w-40 bg-gradient-to-r from-[#B19EEF]/80 via-[#03b3c3]/40 to-transparent mb-7" />
        <p className="text-white/50 text-sm md:text-base font-light tracking-wide max-w-2xl mb-16 md:mb-24">
          Certifications and recognitions across cloud, machine learning, deep learning, and problem solving.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
          {certifications.map((cert, i) => (
            <div
              key={i}
              className="cert-card group relative rounded-2xl border border-white/10 bg-black/38 backdrop-blur-md overflow-visible hover:bg-white/[0.045] hover:border-white/18 transition-all duration-500 ease-out flex flex-col items-start text-left shadow-[0_0_40px_rgba(0,0,0,0.45)]"
            >
              <div className="absolute -inset-x-0 -bottom-32 h-64 bg-gradient-to-t from-[#B19EEF]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 rounded-b-3xl" />

              {/* Image Banner */}
              <div className="w-full h-48 md:h-56 bg-[#1a1a24] relative overflow-hidden flex items-center justify-center border-b border-white/10 rounded-t-2xl md:rounded-t-3xl z-10 group-hover:border-white/20 transition-colors duration-500">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {!cert.image && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/10 -z-10 bg-[#08080c]">
                    <FileBadge size={48} strokeWidth={1} />
                    <span className="text-xs uppercase tracking-widest">Image Missing</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8 flex flex-col flex-grow w-full z-10 relative">
                <div className="flex justify-between items-start w-full mb-4 relative z-20">
                  <span className="text-[#03b3c3]/60 font-mono text-[10px] md:text-xs tracking-[0.28em] uppercase leading-tight max-w-[80%]">
                    {cert.issuer}
                  </span>

                  {/* Interactive Info Toggle (Only if Credential URL exists) */}
                  {cert.credentialUrl && (
                    <div className="relative">
                      <button
                        onClick={() => setActiveInfo(activeInfo === i ? null : i)}
                        onBlur={() => setTimeout(() => setActiveInfo(null), 200)}
                        className={`transition-colors duration-300 z-30 p-1 -m-1 rounded-full hover:bg-white/10 ${activeInfo === i ? 'text-[#B19EEF]' : 'text-white/30 hover:text-white'}`}
                        title="More Info"
                      >
                        <Info size={20} strokeWidth={1.5} />
                      </button>

                      {/* Small Dropdown Menu for View Badge only */}
                      <div
                        className={`absolute right-0 top-full mt-2 w-48 bg-[#0a0a0f] border border-white/10 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 origin-top-right ${activeInfo === i ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
                      >
                        <div className="flex flex-col p-1">
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                          >
                            <ExternalLink size={16} className="text-[#B19EEF]" />
                            View Badge
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="font-inter text-xl md:text-2xl text-white font-medium mb-3 leading-snug group-hover:text-[#B19EEF] transition-colors duration-300 relative z-10 pointer-events-none">
                  {cert.title}
                </h3>

                <p className={`text-white/40 font-light text-xs md:text-sm relative z-10 pointer-events-none ${cert.verificationUrl ? 'mb-6' : 'mt-auto'}`}>
                  Issued: <span className="text-white/70 tracking-wider block mt-1">{cert.date}</span>
                </p>

                {/* Footer Action - Verify Certification */}
                {cert.verificationUrl && (
                  <div className="mt-auto w-full pt-5 border-t border-white/5 flex items-center justify-between">
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-[#03b3c3]/70 hover:text-[#03b3c3] group/btn transition-colors duration-300"
                    >
                      <span className="relative">
                        View Certification
                        <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#03b3c3] transition-all duration-300 group-hover/btn:w-full" />
                      </span>
                      <ShieldCheck size={16} className="opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certifications;
