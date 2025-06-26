import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export interface FeatureProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  return (
    <motion.div
      ref={ref}
      className="p-6 rounded-xl card-theme theme-transition"
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      variants={{
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6,
            delay: delay,
            ease: "easeOut"
          }
        }
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <motion.div 
        className="mb-6 bg-[--accent-primary]/15 w-16 h-16 flex items-center justify-center rounded-full"
        initial={{ scale: 0.8, rotate: -10 }}
        animate={controls}
        variants={{
          visible: { 
            scale: 1, 
            rotate: 0,
            transition: { 
              type: "spring", 
              stiffness: 300, 
              delay: delay + 0.2 
            } 
          }
        }}
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { type: "spring", stiffness: 500 }  
        }}
      >
        {React.cloneElement(icon, { 
          className: "w-8 h-8 text-[--accent-primary]" 
        })}
      </motion.div>
      <h3 className="text-xl font-bold mb-3 text-theme-primary theme-transition">{title}</h3>
      <p className="text-theme-secondary theme-transition">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
