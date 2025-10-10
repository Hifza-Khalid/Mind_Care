import { motion, useAnimation, useInView } from "framer-motion";
import React, { useRef, useEffect } from "react";

interface ScrollFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

const ScrollFadeIn: React.FC<ScrollFadeInProps> = ({
  children,
  className,
  delay = 0,
  yOffset = 24,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("animate");
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={{
        initial: { opacity: 0, y: yOffset },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] },
        },
      }}
      className={className}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollFadeIn;
