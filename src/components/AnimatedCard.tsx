import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      className={`bg-[--card-bg] border border-[--border-color] shadow-lg rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 25px rgba(138, 43, 226, 0.2)',
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
