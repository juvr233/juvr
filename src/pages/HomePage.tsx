import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Star, Sparkles, ArrowRight, Sun, Zap, Users, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#8A2BE2]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF00FF]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-[#FFFFFF] mb-6 leading-tight">
              Discover Your
              <span className="text-[#8A2BE2]"> Destiny</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A0A0A0] mb-8 max-w-3xl mx-auto">
              Unlock the secrets of your life path through personalized numerology readings, mystical tarot guidance, 
              and ancient I Ching wisdom. Get insights into your personality, relationships, and future possibilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/calculator"
                className="bg-[#8A2BE2] text-[#FFFFFF] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#FF00FF] transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <Calculator className="h-5 w-5" />
                <span>Start Free Reading</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/tarot?cards=3"
                className="border-2 border-[#8A2BE2]/50 text-[#FFFFFF] px-8 py-4 rounded-full font-semibold hover:bg-[#8A2BE2]/10 hover:border-[#8A2BE2] transition-all duration-300 flex items-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>Try Tarot Reading</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#8A2BE2] mb-2 group-hover:scale-110 transition-transform">50,000+</div>
                <div className="text-[#A0A0A0]">Readings Completed</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#8A2BE2] mb-2 group-hover:scale-110 transition-transform">98%</div>
                <div className="text-[#A0A0A0]">Accuracy Rate</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#8A2BE2] mb-2 group-hover:scale-110 transition-transform">4.9★</div>
                <div className="text-[#A0A0A0]">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-20 bg-[#22232E]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-6">
              Choose Your Mystical Journey
            </h2>
            <p className="text-xl text-[#A0A0A0] max-w-3xl mx-auto">
              Select from our four powerful divination methods to unlock the secrets of your destiny 
              and receive personalized guidance for your life path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Life Path Analysis */}
            <div className="bg-[#22232E] rounded-3xl p-10 hover:bg-[#22232E]/80 transition-all duration-300 group border border-[#8A2BE2]/20 text-center">
              <div className="bg-[#8A2BE2]/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[#8A2BE2]/30 transition-all duration-300">
                <Sun className="h-10 w-10 text-[#8A2BE2]" />
              </div>
              <h3 className="text-2xl font-bold text-[#FFFFFF] mb-4">Life Path Analysis</h3>
              <p className="text-[#A0A0A0] mb-8 leading-relaxed">
                Discover your core life purpose, natural talents, and the path you're meant to walk 
                based on your birth date and name calculations through ancient numerology wisdom.
              </p>
              <Link 
                to="/calculator" 
                className="bg-[#8A2BE2] text-[#FFFFFF] px-8 py-4 rounded-2xl font-bold hover:bg-[#FF00FF] transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
              >
                <Calculator className="h-5 w-5" />
                <span>Start Analysis</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Tarot Three Cards */}
            <div className="bg-[#22232E] rounded-3xl p-10 hover:bg-[#22232E]/80 transition-all duration-300 group border border-[#8A2BE2]/20 text-center">
              <div className="bg-[#8A2BE2]/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[#8A2BE2]/30 transition-all duration-300">
                <Zap className="h-10 w-10 text-[#8A2BE2]" />
              </div>
              <h3 className="text-2xl font-bold text-[#FFFFFF] mb-4">Tarot Three Cards</h3>
              <p className="text-[#A0A0A0] mb-8 leading-relaxed">
                Receive mystical guidance through a classic 3-card tarot spread revealing your past, 
                present, and future. Perfect for quick insights and daily guidance.
              </p>
              <Link 
                to="/tarot?cards=3" 
                className="bg-[#8A2BE2] text-[#FFFFFF] px-8 py-4 rounded-2xl font-bold hover:bg-[#FF00FF] transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>Draw 3 Cards</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Tarot Five Cards */}
            <div className="bg-[#22232E] rounded-3xl p-10 hover:bg-[#22232E]/80 transition-all duration-300 group border border-[#8A2BE2]/20 text-center">
              <div className="bg-[#8A2BE2]/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[#8A2BE2]/30 transition-all duration-300">
                <Star className="h-10 w-10 text-[#8A2BE2]" />
              </div>
              <h3 className="text-2xl font-bold text-[#FFFFFF] mb-4">Tarot Five Cards</h3>
              <p className="text-[#A0A0A0] mb-8 leading-relaxed">
                Dive deeper with a comprehensive 5-card tarot spread that explores your situation, 
                challenges, advice, and potential outcomes for detailed life guidance.
              </p>
              <Link 
                to="/tarot?cards=5" 
                className="bg-[#8A2BE2] text-[#FFFFFF] px-8 py-4 rounded-2xl font-bold hover:bg-[#FF00FF] transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
              >
                <Star className="h-5 w-5" />
                <span>Draw 5 Cards</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Zhouyi Numerology */}
            <div className="bg-[#22232E] rounded-3xl p-10 hover:bg-[#22232E]/80 transition-all duration-300 group border border-[#8A2BE2]/20 text-center">
              <div className="bg-[#8A2BE2]/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[#8A2BE2]/30 transition-all duration-300">
                <BookOpen className="h-10 w-10 text-[#8A2BE2]" />
              </div>
              <h3 className="text-2xl font-bold text-[#FFFFFF] mb-4">Zhouyi Numerology</h3>
              <p className="text-[#A0A0A0] mb-8 leading-relaxed">
                Consult the ancient Chinese I Ching wisdom for strategic life guidance. 
                Understand your situation and receive insights on how to act with virtue and wisdom.
              </p>
              <Link 
                to="/zhouyi" 
                className="bg-[#8A2BE2] text-[#FFFFFF] px-8 py-4 rounded-2xl font-bold hover:bg-[#FF00FF] transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>Consult I Ching</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-[#FFFFFF] mb-8">Additional Features</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/compatibility"
                className="bg-[#22232E] rounded-2xl px-6 py-4 border border-[#8A2BE2]/20 hover:bg-[#22232E]/80 transition-all duration-300 flex items-center space-x-3 text-[#FFFFFF]"
              >
                <Users className="h-5 w-5 text-[#8A2BE2]" />
                <span>Compatibility Testing</span>
              </Link>
              <Link
                to="/profile"
                className="bg-[#22232E] rounded-2xl px-6 py-4 border border-[#8A2BE2]/20 hover:bg-[#22232E]/80 transition-all duration-300 flex items-center space-x-3 text-[#FFFFFF]"
              >
                <Calculator className="h-5 w-5 text-[#8A2BE2]" />
                <span>View Profile</span>
              </Link>
              <Link
                to="/about"
                className="bg-[#22232E] rounded-2xl px-6 py-4 border border-[#8A2BE2]/20 hover:bg-[#22232E]/80 transition-all duration-300 flex items-center space-x-3 text-[#FFFFFF]"
              >
                <Sparkles className="h-5 w-5 text-[#8A2BE2]" />
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-6">
              How It Works
            </h2>
            <p className="text-xl text-[#A0A0A0]">
              Simple steps to unlock your mystical insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#8A2BE2]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#FFFFFF]">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">Choose Your Reading</h3>
              <p className="text-[#A0A0A0]">
                Select from Life Path Analysis, Tarot Cards, I Ching, or Compatibility based on your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#8A2BE2]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#FFFFFF]">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">Provide Information</h3>
              <p className="text-[#A0A0A0]">
                Enter your details for numerology, focus your intention for cards, or ask your question for I Ching.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#8A2BE2]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#FFFFFF]">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">Sacred Ceremony</h3>
              <p className="text-[#A0A0A0]">
                Experience the mystical process as ancient wisdom aligns with your energy and intention.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#8A2BE2]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-[#FFFFFF]">4</span>
              </div>
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">Receive Wisdom</h3>
              <p className="text-[#A0A0A0]">
                Get detailed interpretations and guidance to help you navigate your life journey with clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#22232E]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-[#A0A0A0]">
              Discover how ancient wisdom has transformed lives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#22232E] rounded-2xl p-8 border border-[#8A2BE2]/20">
              <div className="flex items-center mb-4">
                <div className="flex text-[#8A2BE2]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[#FFFFFF] mb-6">
                "The Life Path Analysis was incredibly accurate and helped me understand my true calling. It gave me the confidence to pursue my dreams."
              </p>
              <div className="text-[#FFFFFF] font-semibold">Sarah M.</div>
              <div className="text-[#A0A0A0] text-sm">Life Coach</div>
            </div>

            <div className="bg-[#22232E] rounded-2xl p-8 border border-[#8A2BE2]/20">
              <div className="flex items-center mb-4">
                <div className="flex text-[#8A2BE2]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[#FFFFFF] mb-6">
                "The I Ching consultation provided exactly the strategic guidance I needed for my business decision. The ancient wisdom is truly profound."
              </p>
              <div className="text-[#FFFFFF] font-semibold">Michael R.</div>
              <div className="text-[#A0A0A0] text-sm">Entrepreneur</div>
            </div>

            <div className="bg-[#22232E] rounded-2xl p-8 border border-[#8A2BE2]/20">
              <div className="flex items-center mb-4">
                <div className="flex text-[#8A2BE2]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[#FFFFFF] mb-6">
                "The 5-card tarot spread gave me such detailed insights into my relationship situation. It helped me make the right choice for my future."
              </p>
              <div className="text-[#FFFFFF] font-semibold">Emma L.</div>
              <div className="text-[#A0A0A0] text-sm">Artist</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-6">
            Ready to Unlock Your Destiny?
          </h2>
          <p className="text-xl text-[#A0A0A0] mb-8">
            Join thousands of others who have discovered their true path through numerology, tarot, and I Ching guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calculator"
              className="bg-[#8A2BE2] text-[#FFFFFF] px-12 py-4 rounded-full font-bold text-xl hover:bg-[#FF00FF] transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3"
            >
              <Calculator className="h-6 w-6" />
              <span>Start Your Journey</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
            <Link
              to="/zhouyi"
              className="border-2 border-[#8A2BE2]/50 text-[#FFFFFF] px-12 py-4 rounded-full font-bold text-xl hover:bg-[#8A2BE2]/10 hover:border-[#8A2BE2] transition-all duration-300 inline-flex items-center space-x-3"
            >
              <BookOpen className="h-6 w-6" />
              <span>Consult I Ching</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}