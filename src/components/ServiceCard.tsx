import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  link, 
  buttonText, 
  index 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        transition: {
          duration: 0.6,
          delay: index * 0.15,
          ease: "easeOut"
        }
      } : { opacity: 0, y: 30 }}
      className="card-theme rounded-3xl p-8 flex flex-col h-full overflow-hidden relative theme-transition"
      whileHover={{
        y: -8,
        boxShadow: '0 20px 30px var(--shadow-color)',
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      {/* 背景装饰元素 */}
      <motion.div 
        className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[--accent-primary]/5 blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="bg-[--accent-primary]/15 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative z-10"
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          transition: { 
            type: "spring",
            stiffness: 300,
            delay: index * 0.15 + 0.2,
            duration: 0.5
          } 
        }}
        whileHover={{
          scale: 1.1,
          rotate: [0, 5, 0, -5, 0],
          transition: {
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <Icon className="h-10 w-10 text-[--accent-primary]" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-theme-primary mb-4 relative z-10 theme-transition">{title}</h3>
      
      <p className="text-theme-secondary mb-6 flex-grow relative z-10 theme-transition">{description}</p>
      
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ 
          scale: 1.05, 
          backgroundColor: 'var(--button-hover)',
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        className="relative z-10"
      >
        <Link 
          to={link}
          className="bg-[--accent-primary] text-white px-6 py-3 rounded-xl font-bold inline-flex items-center space-x-2 w-full justify-center"
        >
          <Icon className="h-5 w-5" />
          <span>{buttonText}</span>
          <motion.span
            initial={{ x: -5, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard;
