import { motion, Variants } from 'framer-motion';
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const variants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={variants}
    className={className}
    style={{willChange:'opacity, transform'}}
  >
    {children}
  </motion.div>
);

export default PageTransition;
