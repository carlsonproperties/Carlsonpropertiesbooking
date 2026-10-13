import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface EditorialPreloaderProps {
  onComplete?: () => void;
}

export function EditorialPreloader({ onComplete }: EditorialPreloaderProps) {
  const [count, setCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw the loader in this session
    const seen = sessionStorage.getItem("carlson_preloader_seen");
    if (seen) {
      setIsDone(true);
      onComplete?.();
      return;
    }

    const duration = 1400; // ms
    const target = 111; // 111 Jarden Mile
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          setIsDone(true);
          sessionStorage.setItem("carlson_preloader_seen", "1");
          onComplete?.();
        }, 350);
      }
    };

    requestAnimationFrame(frame);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col justify-between bg-[#203F3A] text-[#F4F1EA] p-8 md:p-14 overflow-hidden"
        >
          {/* Header meta */}
          <div className="flex justify-between items-center text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-medium text-[#D7C8B4]">
            <span>Carlson Properties</span>
            <span>Taupō · New Zealand</span>
          </div>

          {/* Centerpiece: 111 counter + title */}
          <div className="max-w-4xl mx-auto w-full text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-7xl sm:text-9xl md:text-[12rem] font-serif font-light tracking-tighter text-[#F4F1EA] leading-none mb-4"
            >
              {String(count).padStart(3, "0")}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-2"
            >
              <p className="text-xs md:text-sm font-sans uppercase tracking-[0.45em] text-[#D7C8B4] font-medium">
                One Eleven on the Mile
              </p>
              <p className="text-[11px] font-sans text-[#F4F1EA]/60 italic font-light">
                Holiday accommodation with heated pool, cedar sauna & lake vistas
              </p>
            </motion.div>
          </div>

          {/* Footer status */}
          <div className="flex justify-between items-end border-t border-[#D7C8B4]/20 pt-4 text-[10px] uppercase tracking-[0.25em] text-[#D7C8B4]/70">
            <span>Arrival Experience</span>
            <span>111 Jarden Mile</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
