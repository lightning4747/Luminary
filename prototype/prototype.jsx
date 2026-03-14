import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LUMINARY: Cinematic Art Gallery
 * Core Physics: Spring-based drag navigation
 */

const LUMINARY_THEME = {
  canvas: '#0A0A0A',
  ivory: '#F0EDE6',
  accent: '#C8B89A',
  mid: '#666666',
};

const IMAGES = [
  {
    id: "01",
    src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1600",
    title: "Morning Mist",
    number: "No. 01",
    themeText: "stillness in light",
  },
  {
    id: "02",
    src: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=1600",
    title: "Tokyo Rain",
    number: "No. 02",
    themeText: "solitude in geometry",
  },
  {
    id: "03",
    src: "https://images.unsplash.com/photo-1449156003053-c30420941005?auto=format&fit=crop&q=80&w=1600",
    title: "Alpine Echo",
    number: "No. 03",
    themeText: "architecture of peaks",
  },
  {
    id: "04",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600",
    title: "Emerald Pass",
    number: "No. 04",
    themeText: "unfolding horizons",
  },
  {
    id: "05",
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600",
    title: "Velvet Valley",
    number: "No. 05",
    themeText: "rhythm of the land",
  }
];

// Spring configuration from spec
const springConfig = {
  type: 'spring',
  stiffness: 55,
  damping: 18,
  mass: 1.2,
};

const App = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setIndex((prevIndex) => (prevIndex + newDirection + IMAGES.length) % IMAGES.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeImage = IMAGES[index];
  const prevIndex = (index - 1 + IMAGES.length) % IMAGES.length;
  const nextIndex = (index + 1) % IMAGES.length;

  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-center relative select-none" 
         style={{ backgroundColor: LUMINARY_THEME.canvas, color: LUMINARY_THEME.ivory }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=DM+Mono:wght@300;400&display=swap');
          .font-display { font-family: 'Cormorant Garamond', serif; font-style: italic; }
          .font-ui { font-family: 'DM Mono', monospace; }
          .grain {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 50; opacity: 0.04;
            background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          }
          .image-shadow { box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8); }
        `}
      </style>

      <div className="grain" />

      {/* Main Gallery Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* PREVIOUS PREVIEW (Top Left) */}
        <motion.div 
          key={`prev-${index}`}
          initial={{ x: '-38vw', y: '-30vh', scale: 0.28, opacity: 0 }}
          animate={{ x: '-38vw', y: '-30vh', scale: 0.28, opacity: 0.45 }}
          transition={springConfig}
          className="absolute z-0 w-[80vw] h-[80vh] cursor-pointer overflow-hidden"
          onClick={() => paginate(-1)}
        >
          <img src={IMAGES[prevIndex].src} className="w-full h-full object-cover" alt="prev" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* ACTIVE IMAGE */}
        <motion.div
          key={activeImage.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(e, info) => {
            if (info.offset.x < -80) paginate(1);
            else if (info.offset.x > 80) paginate(-1);
          }}
          initial={{ 
            x: direction > 0 ? '38vw' : '-38vw', 
            y: direction > 0 ? '30vh' : '-30vh', 
            scale: 0.28, 
            opacity: 0.45 
          }}
          animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          exit={{ 
            x: direction > 0 ? '-38vw' : '38vw', 
            y: direction > 0 ? '-30vh' : '30vh', 
            scale: 0.28, 
            opacity: 0.45 
          }}
          transition={springConfig}
          className="relative z-10 w-[80vw] h-[80vh] max-h-[800px] cursor-grab active:cursor-grabbing overflow-hidden image-shadow"
        >
          <motion.img 
            src={activeImage.src} 
            className="w-full h-full object-contain pointer-events-none" 
            alt={activeImage.title}
          />
        </motion.div>

        {/* NEXT PREVIEW (Bottom Right) */}
        <motion.div 
          key={`next-${index}`}
          initial={{ x: '38vw', y: '30vh', scale: 0.28, opacity: 0 }}
          animate={{ x: '38vw', y: '30vh', scale: 0.28, opacity: 0.45 }}
          transition={springConfig}
          className="absolute z-0 w-[80vw] h-[80vh] cursor-pointer overflow-hidden"
          onClick={() => paginate(1)}
        >
          <img src={IMAGES[nextIndex].src} className="w-full h-full object-cover" alt="next" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </div>

      {/* OVERLAY TEXT */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`text-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {/* Top Right */}
          <div className="absolute top-12 right-12 z-20 text-right">
            <span className="font-display text-[1.1rem] tracking-wide" style={{ color: LUMINARY_THEME.accent }}>
              {activeImage.themeText}
            </span>
          </div>

          {/* Bottom Left */}
          <div className="absolute bottom-12 left-12 z-20">
            <div className="flex flex-col gap-1">
              <span className="font-ui text-[0.65rem] uppercase tracking-[0.2em]" style={{ color: LUMINARY_THEME.mid }}>
                {activeImage.number}
              </span>
              <h1 className="font-display text-[2.4rem] leading-none">
                {activeImage.title}
              </h1>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full"
            initial={false}
            animate={{ width: `${((index + 1) / IMAGES.length) * 100}%` }}
            transition={springConfig}
            style={{ backgroundColor: LUMINARY_THEME.ivory }} 
          />
        </div>
        <span className="font-ui text-[0.7rem] tracking-[0.3em] opacity-40 uppercase">
          {String(index + 1).padStart(2, '0')} / {String(IMAGES.length).padStart(2, '0')}
        </span>
      </div>

    </div>
  );
};

export default App;