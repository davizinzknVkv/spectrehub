import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface LenticularCardProps {
  item: any;
  isActive: boolean;
  width: number;
  borderRadius: number;
  tilt: number;
  perspective: number;
  inactiveScale: number;
  inactiveDim: number;
}

const LenticularCard = ({
  item,
  isActive,
  width,
  borderRadius,
  tilt,
  perspective,
  inactiveScale,
  inactiveDim,
}: LenticularCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-width / 2, width / 2], [tilt, -tilt]);
  const rotateY = useTransform(x, [-width / 2, width / 2], [-tilt, tilt]);

  const springConfig = { damping: 20, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // Parallax effects for internal elements
  const iconX = useTransform(x, [-width / 2, width / 2], [-10, 10]);
  const iconY = useTransform(y, [-width / 2, width / 2], [-10, 10]);
  
  const textX = useTransform(x, [-width / 2, width / 2], [-5, 5]);
  const textY = useTransform(y, [-width / 2, width / 2], [-5, 5]);

  // Shine effect
  const shineX = useTransform(x, [-width / 2, width / 2], [100, 0]);
  const shineY = useTransform(y, [-width / 2, width / 2], [100, 0]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Icon = item.icon;

  return (
    <motion.div
      onMouseMove={isActive ? handleMouseMove : undefined}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: perspective,
        width: width,
        height: width * 1.4,
      }}
      className="relative cursor-pointer group"
    >
      <motion.div
        style={{
          rotateX: isActive ? springRotateX : 0,
          rotateY: isActive ? springRotateY : 0,
          scale: isActive ? 1 : inactiveScale,
          opacity: isActive ? 1 : inactiveDim,
          transformStyle: "preserve-3d",
          borderRadius: 0,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full relative bg-[#050505] border border-white/5 overflow-hidden"
      >
        {/* Lenticular / Shine Layer */}
        {isActive && (
          <motion.div 
            style={{
              background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(77, 160, 158, 0.15) 0%, transparent 70%)`,
              transform: "translateZ(50px)"
            }}
            className="absolute inset-0 z-10 pointer-events-none"
          />
        )}

        {/* Scanline / Grid Effect */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Image / Preview */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            {item.previewUrl ? (
              <motion.img 
                key={item.previewUrl}
                src={item.previewUrl}
                alt={item.name}
                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                style={{ transform: "translateZ(-20px) scale(1.1)" }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#151515] to-black flex items-center justify-center">
                 <Icon className="w-20 h-20 text-white/5" />
              </div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end z-20" style={{ transformStyle: "preserve-3d" }}>
          {/* Badge / Category */}
          <motion.div 
             style={{ x: isActive ? textX : 0, y: isActive ? textY : 0, transform: "translateZ(30px)" }}
             className="flex items-center gap-2 mb-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#005194]" />
            <span className="font-display text-[9px] uppercase tracking-[0.2em] text-primary italic font-bold">
              {item.category}
            </span>
            <span className="text-[8px] text-white/20 uppercase tracking-widest ml-auto">{item.status}</span>
          </motion.div>

          {/* Title */}
          <motion.h3 
             style={{ x: isActive ? textX : 0, y: isActive ? textY : 0, transform: "translateZ(40px)" }}
             className="font-display text-2xl text-white uppercase italic tracking-tighter leading-none mb-2"
          >
            {item.name}
          </motion.h3>

          {/* Description */}
          <motion.p 
            style={{ x: isActive ? textX : 0, y: isActive ? textY : 0, transform: "translateZ(20px)" }}
            className="font-sans text-[11px] text-white/40 uppercase tracking-[0.1em] leading-relaxed line-clamp-3 mb-6"
          >
            {item.desc}
          </motion.p>

          {/* Action */}
          <motion.div
            style={{ transform: "translateZ(50px)" }}
            className="flex items-center justify-between"
          >
            <Link 
              to={item.to}
              className="ds-btn ds-btn-primary !py-2 !px-5 !text-[9px] !min-h-0 !h-10 w-full"
            >
              RUN_MODULE
            </Link>
          </motion.div>
        </div>

        {/* Industrial Corner Decorator */}
        <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-primary/20 z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary z-30 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

interface LenticularCarouselProps {
  items: any[];
  cardWidth?: number;
  gap?: number;
  borderRadius?: number;
  tilt?: number;
  perspective?: number;
  inactiveScale?: number;
  inactiveDim?: number;
  speed?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  showControls?: boolean;
  showDots?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  enableDrag?: boolean;
  enableKeyboard?: boolean;
}

export function LenticularCarousel({
  items,
  cardWidth = 260,
  gap = 26,
  borderRadius = 14,
  tilt = 12,
  perspective = 1600,
  inactiveScale = 0.9,
  inactiveDim = 0.55,
  speed = 0.8,
  trigger = 'hover',
  showLabels = true,
  showControls = true,
  showDots = true,
  loop = true,
  autoplay = false,
  enableDrag = true,
  enableKeyboard = true,
}: LenticularCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));
  const containerRef = useRef<HTMLDivElement>(null);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (!enableKeyboard) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboard]);

  return (
    <div className="relative w-full py-20 overflow-hidden" ref={containerRef}>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Carousel Container */}
      <div className="relative flex items-center justify-center min-h-[500px]">
        <motion.div 
          className="flex items-center"
          animate={{ x: -(activeIndex * (cardWidth + gap)) }}
          transition={{ duration: speed, ease: [0.16, 1, 0.3, 1] }}
        >
          {items.map((item, index) => (
            <div 
              key={item.id} 
              style={{ marginRight: index === items.length - 1 ? 0 : gap }}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => trigger === 'hover' && setActiveIndex(index)}
            >
              <LenticularCard
                item={item}
                isActive={activeIndex === index}
                width={cardWidth}
                borderRadius={borderRadius}
                tilt={tilt}
                perspective={perspective}
                inactiveScale={inactiveScale}
                inactiveDim={inactiveDim}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-10 pointer-events-none">
          <button 
            onClick={prev}
            className="w-10 h-10 border border-white/5 flex items-center justify-center text-white/20 hover:text-primary hover:border-primary/30 transition-all pointer-events-auto"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={next}
            className="w-10 h-10 border border-white/5 flex items-center justify-center text-white/20 hover:text-primary hover:border-primary/30 transition-all pointer-events-auto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Dots */}
      {showDots && (
        <div className="flex justify-center gap-3 mt-12 relative z-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1 transition-all duration-500 ${
                activeIndex === i 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-white/10 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Labels / Info for current card */}
      {showLabels && (
        <div className="text-center mt-12">
           <div className="font-display text-[9px] tracking-[0.5em] text-white/10 uppercase">
             SYS_ID: 0{activeIndex + 1} // TOTAL_DEPLOYED: {items.length}
           </div>
        </div>
      )}
    </div>
  );
}
