import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function CustomCursor() {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "action">("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch-only devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest("[data-cursor]") as HTMLElement | null;

      if (cursorTarget) {
        const text = cursorTarget.getAttribute("data-cursor") || "";
        setCursorText(text);
        setCursorVariant("action");
      } else if (target?.closest("a, button, input, [role='button']")) {
        setCursorText("");
        setCursorVariant("hover");
      } else {
        setCursorText("");
        setCursorVariant("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer follow capsule/circle */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: cursorVariant === "action" ? (cursorText.length > 5 ? 100 : 76) : cursorVariant === "hover" ? 44 : 28,
          height: cursorVariant === "action" ? 36 : cursorVariant === "hover" ? 44 : 28,
          borderRadius: cursorVariant === "action" ? 9999 : 9999,
          backgroundColor: cursorVariant === "action" ? "rgba(32, 63, 58, 0.95)" : "rgba(215, 200, 180, 0.35)",
          borderColor: cursorVariant === "action" ? "#D7C8B4" : "#203F3A",
          borderWidth: cursorVariant === "action" ? 1 : 1.5,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="flex items-center justify-center backdrop-blur-sm shadow-sm"
      >
        {cursorText && (
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#F4F1EA] select-none">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Center pinpoint */}
      {cursorVariant !== "action" && (
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="w-1.5 h-1.5 rounded-full bg-[#203F3A]"
        />
      )}
    </div>
  );
}
