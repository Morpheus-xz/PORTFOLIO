
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LoaderProps {
  onRevealApp: () => void;
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onRevealApp, onComplete }) => {
  const counterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const completionTriggeredRef = useRef(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: 100,
        duration: 3.8,
        ease: "power1.inOut",
        onUpdate: () => {
          setCount(Math.floor(obj.value));
        },
        onComplete: () => {
          if (completionTriggeredRef.current) return;
          completionTriggeredRef.current = true;

          // Start app reveal exactly when loader exit starts.
          onRevealApp();

          const tl = gsap.timeline();
          tl.to(counterRef.current, {
            scale: 0.82,
            opacity: 0,
            filter: 'blur(6px)',
            duration: 0.55,
            ease: "power3.inOut"
          }, 0);
          tl.to(containerRef.current, {
            opacity: 0,
            duration: 0.55,
            ease: "power3.inOut"
          }, 0.04);
          tl.call(() => onComplete());
        }
      });
    });
    return () => ctx.revert();
  }, [onComplete, onRevealApp]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="relative text-center">
        <div 
          ref={counterRef}
          className="text-8xl md:text-[12rem] font-bold tracking-tighter text-[#F5F5F5]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {count}%
        </div>
        <div className="text-xs uppercase tracking-[0.4em] opacity-40 mt-4">
          Architecting Reality
        </div>
      </div>
    </div>
  );
};

export default Loader;
