import React, { useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../data/gallery';
import GalleryImage from './GalleryImage';
import ProgressBar from './ProgressBar';
import OverlayText from './OverlayText';
import { useKeyNav } from '../hooks/useKeyNav';
import styles from '../styles/Gallery.module.css';

const springConfig = {
  type: 'spring',
  stiffness: 70,
  damping: 20,
  mass: 1,
};

const Gallery: React.FC = () => {
  const [index, setIndex] = useState(0);
  
  // Motion value for horizontal drag distance
  const dragX = useMotionValue(0);
  // Smooth out the drag value with a spring
  const smoothDragX = useSpring(dragX, { stiffness: 400, damping: 40 });

  const paginate = useCallback((newDirection: number) => {
    setIndex((prevIndex) => (prevIndex + newDirection + IMAGES.length) % IMAGES.length);
    dragX.stop(); // Stop any current spring/animation
    dragX.set(0);
  }, [dragX]);

  useKeyNav(() => paginate(-1), () => paginate(1));

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 150;
    if (info.offset.x < -threshold) {
      paginate(1);
    } else if (info.offset.x > threshold) {
      paginate(-1);
    }
    dragX.set(0);
  };

  const activeImage = IMAGES[index];

  // Render indices: previous, current, next
  const visibleIndices = useMemo(() => {
    const prev = (index - 1 + IMAGES.length) % IMAGES.length;
    const next = (index + 1) % IMAGES.length;
    return [prev, index, next];
  }, [index]);

  return (
    <main className={styles.viewport}>
      <div className="grain" />
      
      {/* Radiant atmospheric background */}
      <div className={styles.glowContainer}>
        <div className={`${styles.glow} ${styles.glow1}`} />
        <div className={`${styles.glow} ${styles.glow2}`} />
        <div className={`${styles.glow} ${styles.glow3}`} />
        {/* Slow glowing particles */}
        <div className={`${styles.particle} ${styles.particle1}`} />
        <div className={`${styles.particle} ${styles.particle2}`} />
        <div className={`${styles.particle} ${styles.particle3}`} />
        <div className={`${styles.particle} ${styles.particle4}`} />
        <div className={`${styles.particle} ${styles.particle5}`} />
        <div className={`${styles.particle} ${styles.particle6}`} />
        <div className={`${styles.particle} ${styles.particle7}`} />
        <div className={`${styles.particle} ${styles.particle8}`} />
        <div className={`${styles.particle} ${styles.particle9}`} />
        <div className={`${styles.particle} ${styles.particle10}`} />
      </div>

      {/* Static Background Frame with Corner Brackets */}
      <div className={styles.staticFrame}>
        {/* Top Left */}
        <div className={`${styles.marker} ${styles.markerTL_H}`} />
        <div className={`${styles.marker} ${styles.markerTL_V}`} />
        
        {/* Top Right */}
        <div className={`${styles.marker} ${styles.markerTR_H}`} />
        <div className={`${styles.marker} ${styles.markerTR_V}`} />
        
        {/* Bottom Left */}
        <div className={`${styles.marker} ${styles.markerBL_H}`} />
        <div className={`${styles.marker} ${styles.markerBL_V}`} />
        
        {/* Bottom Right */}
        <div className={`${styles.marker} ${styles.markerBR_H}`} />
        <div className={`${styles.marker} ${styles.markerBR_V}`} />
      </div>

      <motion.div 
        className={styles.galleryContainer}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDrag={(_, info) => dragX.set(info.offset.x)}
        onDragEnd={handleDragEnd}
        style={{ cursor: 'grab' }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {visibleIndices.map((i) => (
          <GalleryImage
            key={IMAGES[i].id}
            id={IMAGES[i].id}
            src={IMAGES[i].src}
            index={i}
            activeIndex={index}
            dragX={smoothDragX}
            springConfig={springConfig}
            onClick={() => paginate(i === (index + 1) % IMAGES.length ? 1 : -1)}
          />
        ))}
      </motion.div>

      <OverlayText
        id={activeImage.id}
        number={activeImage.number}
        title={activeImage.title}
        themeText={activeImage.themeText}
      />

      <div className={styles.bottomNav}>
        <ProgressBar
          current={index}
          total={IMAGES.length}
          springConfig={springConfig}
        />
      </div>
    </main>
  );
};
export default Gallery;