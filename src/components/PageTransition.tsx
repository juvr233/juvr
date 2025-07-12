import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

// 创建页面切换动画容器
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// 创建文本渐入动画容器
export const FadeInText: React.FC<{children: React.ReactNode, delay?: number}> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

// 创建列表项依次渐入动画
export const StaggeredList: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
};

// 列表项动画
export const ListItem: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
