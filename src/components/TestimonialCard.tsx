import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TestimonialProps {
  name: string;
  text: string;
  rating: number;
  position?: string;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ name, text, rating, position, delay = 0 }) => {
  return (
    <motion.div
      className="bg-theme-secondary/30 p-6 rounded-2xl border border-[--border-color] backdrop-blur-sm theme-transition"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 25px var(--shadow-color)',
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            fill={i < rating ? 'currentColor' : 'none'} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`} 
          />
        ))}
      </div>
      <p className="text-theme-primary mb-4 italic theme-transition">"{text}"</p>
      <div>
        <p className="font-semibold text-theme-primary theme-transition">{name}</p>
        {position && <p className="text-sm text-theme-secondary theme-transition">{position}</p>}
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
