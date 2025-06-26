import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calculator, Star, ArrowRight, Zap, Users, BookOpen, Check, Clock, Shield, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PageTransition, { FadeInText } from '../components/PageTransition';

export default function HomePage() {
  useTheme(); // 启用主题上下文
  const controls = useAnimation();

  useEffect(() => {
    // 初始加载时触发动画序列
    const sequence = async () => {
      await controls.start({
        opacity: 1,
        transition: { duration: 0.3 }
      });
    };
    
    sequence();
  }, [controls]);

  // 服务卡片数据
  const services = [
    {
      title: "Numerology Analysis",
      description: "Discover your core life purpose, natural talents, and the path you're meant to walk based on your birth date and name through ancient numerology wisdom.",
      icon: Calculator,
      link: "/calculator",
      buttonText: "Start Analysis"
    },
    {
      title: "Tarot Reading",
      description: "Receive mystical guidance about your past, present, and future possibilities through the ancient wisdom of tarot cards. Explore your inner world and potential destiny.",
      icon: Zap,
      link: "/tarot?cards=3",
      buttonText: "Begin Reading"
    },
    {
      title: "I Ching Hexagrams",
      description: "Gain profound insights and guidance through the ancient wisdom of the I Ching. The 64 hexagrams reveal the flow of destiny and the power of change.",
      icon: BookOpen,
      link: "/zhouyi",
      buttonText: "Consult I Ching"
    },
    {
      title: "Compatibility Analysis",
      description: "Understand the compatibility between you and your partner, friend, or colleague. Analyze how number energies interact and influence your relationships.",
      icon: Users,
      link: "/compatibility",
      buttonText: "Check Compatibility"
    }
  ];

  // 特色功能数据
  const features = [
    {
      title: "Accurate Readings",
      description: "Our divination systems are based on ancient wisdom and modern interpretation methods for the most accurate insights possible.",
      icon: <Check className="w-8 h-8 text-[--accent-primary]" />
    },
    {
      title: "Instant Results",
      description: "Get your personalized readings instantly, with no waiting time. All analysis is performed in real-time.",
      icon: <Clock className="w-8 h-8 text-[--accent-primary]" />
    },
    {
      title: "Private & Secure",
      description: "Your data remains private and secure. We never store sensitive personal information or share your details.",
      icon: <Shield className="w-8 h-8 text-[--accent-primary]" />
    },
    {
      title: "Holistic Approach",
      description: "Our systems consider multiple divination methods to provide a comprehensive and well-rounded spiritual guidance.",
      icon: <Heart className="w-8 h-8 text-[--accent-primary]" />
    }
  ];

  // 用户评价数据
  const testimonials = [
    {
      name: "Sarah Thompson",
      position: "Life Coach",
      text: "The numerology reading was incredibly accurate. It provided insights about my life path that helped me make an important career decision.",
      rating: 5
    },
    {
      name: "Michael Chen",
      position: "Software Engineer",
      text: "I was skeptical at first, but the I Ching reading gave me clarity during a confusing time in my life. The guidance was profound and timely.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      position: "Wellness Instructor",
      text: "The compatibility analysis helped me understand relationship dynamics with my partner. It highlighted strengths we weren't fully utilizing.",
      rating: 4
    }
  ];

  return (
    <PageTransition>
      <div className="relative">
        {/* 装饰性背景元素 - 主题感知 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-40 -left-20 w-96 h-96 rounded-full bg-[--accent-primary]/10 blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 5
            }}
            className="absolute top-[60%] -right-20 w-[30rem] h-[30rem] rounded-full bg-[--accent-secondary]/10 blur-[120px]"
          />
        </div>

        {/* Hero 部分 */}
        <section className="relative z-10 pt-16 pb-24 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex flex-col items-center text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut"
              }}
            >
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-theme-primary theme-transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Discover Your
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[--accent-primary] to-[--accent-secondary]"> Destiny</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-theme-secondary theme-transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Unlock the secrets of your life path through personalized numerology readings, 
                mystical tarot guidance, and ancient I Ching wisdom. Get insights into your personality, 
                relationships, and future possibilities.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/calculator"
                    className="bg-gradient-to-r from-[--accent-primary] to-[--accent-secondary] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <Calculator className="h-5 w-5" />
                    <span>Free Reading</span>
                    <ArrowRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/tarot?cards=3"
                    className="border-2 border-[--accent-primary]/50 text-theme-primary px-8 py-4 rounded-full font-semibold hover:bg-[--accent-primary]/10 hover:border-[--accent-primary] transition-all duration-300 flex items-center space-x-2 theme-transition"
                  >
                    <Zap className="h-5 w-5" />
                    <span>Try Tarot</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* 统计数据部分 */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="text-center">
                  <motion.div 
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[--accent-primary] to-[--accent-secondary] mb-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    50,000+
                  </motion.div>
                  <div className="text-theme-secondary theme-transition">Readings Completed</div>
                </div>
                
                <div className="text-center">
                  <motion.div 
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[--accent-primary] to-[--accent-secondary] mb-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    98%
                  </motion.div>
                  <div className="text-theme-secondary theme-transition">Accuracy Rate</div>
                </div>
                
                <div className="text-center">
                  <motion.div 
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[--accent-primary] to-[--accent-secondary] mb-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    4.9 <Star className="h-6 w-6 inline fill-yellow-400 text-yellow-400" />
                  </motion.div>
                  <div className="text-theme-secondary theme-transition">User Rating</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 服务部分 */}
        <section className="py-20 bg-theme-secondary/20 backdrop-blur-sm theme-transition">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <FadeInText>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-theme-primary theme-transition">
                  Choose Your Mystical Journey
                </h2>
                <p className="text-lg sm:text-xl max-w-3xl mx-auto text-theme-secondary theme-transition">
                  Select from our four powerful divination methods to unlock the secrets of your destiny 
                  and receive personalized guidance for your life path.
                </p>
              </div>
            </FadeInText>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    custom={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{
                      y: -10,
                      boxShadow: '0 20px 25px rgba(138, 43, 226, 0.3)',
                      transition: { duration: 0.3 }
                    }}
                    className="card-theme rounded-3xl p-8 flex flex-col h-full theme-transition"
                  >
                    <motion.div 
                      className="bg-[--accent-primary]/15 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[--accent-primary]/30 transition-all duration-300"
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0] 
                      }}
                      transition={{ 
                        duration: 5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <Icon className="h-10 w-10 text-[--accent-primary]" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-theme-primary mb-4 text-center theme-transition">{service.title}</h3>
                    
                    <p className="text-theme-secondary mb-8 leading-relaxed text-center theme-transition flex-grow">
                      {service.description}
                    </p>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-auto"
                    >
                      <Link 
                        to={service.link}
                        className="bg-[--accent-primary] text-white px-6 py-3 rounded-xl font-bold hover:bg-[--button-hover] transition-all duration-300 flex items-center justify-center space-x-2 w-full"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{service.buttonText}</span>
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 特色功能部分 */}
        <section className="py-20 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <FadeInText>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-theme-primary theme-transition">
                  Why Choose Us
                </h2>
                <p className="text-lg sm:text-xl max-w-3xl mx-auto text-theme-secondary theme-transition">
                  Our platform combines ancient wisdom with modern technology to provide you with the most accurate and insightful divination experience.
                </p>
              </div>
            </FadeInText>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  ref={null}
                  className="p-6 rounded-xl card-theme theme-transition"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.6,
                      delay: index * 0.15,
                      ease: "easeOut"
                    }
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <motion.div 
                    className="mb-6 bg-[--accent-primary]/15 w-16 h-16 flex items-center justify-center rounded-full"
                    initial={{ scale: 0.8, rotate: -10 }}
                    whileInView={{
                      scale: 1, 
                      rotate: 0,
                      transition: { 
                        type: "spring", 
                        stiffness: 300, 
                        delay: index * 0.15 + 0.2 
                      } 
                    }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      transition: { type: "spring", stiffness: 500 }  
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-theme-primary theme-transition">{feature.title}</h3>
                  <p className="text-theme-secondary theme-transition">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 用户评价部分 */}
        <section className="py-20 px-4 sm:px-6 md:px-8 bg-theme-secondary/20 backdrop-blur-sm theme-transition">
          <div className="max-w-7xl mx-auto">
            <FadeInText>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-theme-primary theme-transition">
                  What Our Users Say
                </h2>
                <p className="text-lg sm:text-xl max-w-3xl mx-auto text-theme-secondary theme-transition">
                  Discover how our mystic readings have helped people find clarity, purpose, and direction in their lives.
                </p>
              </div>
            </FadeInText>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  className="bg-theme-secondary/30 p-6 rounded-2xl border border-[--border-color] backdrop-blur-sm theme-transition"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
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
                        fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-400'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-theme-primary mb-4 italic theme-transition">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-theme-primary theme-transition">{testimonial.name}</p>
                    {testimonial.position && <p className="text-sm text-theme-secondary theme-transition">{testimonial.position}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 行动号召部分 */}
        <section className="py-20 px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-r from-[--accent-primary]/10 to-[--accent-secondary]/10 backdrop-blur-sm p-8 sm:p-12 md:p-16 rounded-3xl border border-[--border-color] relative overflow-hidden"
            >
              {/* 背景效果 */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[--accent-primary]/20 blur-[80px]"
                />
                <motion.div
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 0],
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-[--accent-secondary]/20 blur-[80px]"
                />
              </div>

              <div className="relative z-10">
                <motion.h2 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-theme-primary theme-transition"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Begin Your Spiritual Journey Today
                </motion.h2>
                
                <motion.p 
                  className="text-lg sm:text-xl mb-10 text-theme-secondary theme-transition"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Take the first step towards understanding yourself, your relationships, and your future. 
                  Our divination tools are waiting to reveal the insights you seek.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-5 justify-center"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/calculator"
                      className="bg-gradient-to-r from-[--accent-primary] to-[--accent-secondary] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Start Free Reading</span>
                      <ArrowRight className="h-5 w-5 ml-1" />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
