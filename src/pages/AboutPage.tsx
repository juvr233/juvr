import React from 'react';
import { Sparkles, Star, Users, Calculator, Heart, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-[#C0A573]/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-[#C0A573]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F0F0F0] mb-6">
            About Zenith Destiny
          </h1>
          <p className="text-xl text-[#C0A573] max-w-3xl mx-auto leading-relaxed">
            We believe that understanding your numbers can unlock profound insights into your life's purpose, 
            relationships, and potential. Our platform combines ancient numerological wisdom with modern technology 
            to provide accurate, personalized readings.
          </p>
        </div>

        {/* What is Numerology */}
        <div className="bg-[#4F4C7A] rounded-3xl p-8 md:p-12 border border-[#C0A573]/20 mb-12">
          <h2 className="text-3xl font-bold text-[#F0F0F0] mb-8 text-center">What is Numerology?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[#C0A573] leading-relaxed mb-6">
                Numerology is the ancient practice of understanding the mystical relationship between numbers 
                and life events. Dating back thousands of years, this sacred science has been used by cultures 
                worldwide to gain insights into personality, destiny, and life purpose.
              </p>
              <p className="text-[#C0A573] leading-relaxed mb-6">
                By analyzing the numbers derived from your name and birth date, numerology reveals patterns 
                and energies that influence your life journey. Each number carries specific vibrations and 
                meanings that can guide you toward greater self-understanding and fulfillment.
              </p>
              <Link
                to="/calculator"
                className="inline-flex items-center space-x-2 bg-[#C0A573] text-[#2C2A4A] px-6 py-3 rounded-xl font-semibold hover:bg-[#D4B885] transform hover:scale-105 transition-all duration-300"
              >
                <span>Try It Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-[#2C2A4A] rounded-2xl p-8 border border-[#C0A573]/10">
              <h3 className="text-xl font-bold text-[#C0A573] mb-4">Core Numbers We Calculate</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-[#C0A573]" />
                  <span className="text-[#F0F0F0]">Life Path Number - Your life's purpose</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-[#C0A573]" />
                  <span className="text-[#F0F0F0]">Expression Number - Your talents</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-[#C0A573]" />
                  <span className="text-[#F0F0F0]">Soul Urge Number - Your desires</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-[#C0A573]" />
                  <span className="text-[#F0F0F0]">Personal Year - Current cycle</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#4F4C7A] rounded-3xl p-8 border border-[#C0A573]/20">
            <div className="bg-[#C0A573]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Calculator className="h-8 w-8 text-[#C0A573]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F0F0F0] mb-4">Accurate Calculations</h3>
            <p className="text-[#C0A573] leading-relaxed">
              We use the traditional Pythagorean numerology system, the most widely recognized and accurate 
              method for numerological calculations. Our algorithms ensure precise results every time.
            </p>
          </div>

          <div className="bg-[#4F4C7A] rounded-3xl p-8 border border-[#C0A573]/20">
            <div className="bg-[#C0A573]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Star className="h-8 w-8 text-[#C0A573]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F0F0F0] mb-4">Detailed Interpretations</h3>
            <p className="text-[#C0A573] leading-relaxed">
              Each number comes with comprehensive interpretations covering personality traits, strengths, 
              challenges, and life guidance. We provide actionable insights you can apply immediately.
            </p>
          </div>

          <div className="bg-[#4F4C7A] rounded-3xl p-8 border border-[#C0A573]/20">
            <div className="bg-[#C0A573]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-[#C0A573]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F0F0F0] mb-4">Relationship Compatibility</h3>
            <p className="text-[#C0A573] leading-relaxed">
              Our compatibility analysis helps you understand relationship dynamics with friends, family, 
              and romantic partners, providing insights for stronger connections.
            </p>
          </div>

          <div className="bg-[#4F4C7A] rounded-3xl p-8 border border-[#C0A573]/20">
            <div className="bg-[#C0A573]/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-[#C0A573]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F0F0F0] mb-4">Privacy & Security</h3>
            <p className="text-[#C0A573] leading-relaxed">
              Your personal information is completely secure with us. We never share your data with third 
              parties and use industry-standard encryption to protect your privacy.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-[#4F4C7A] rounded-3xl p-8 md:p-12 border border-[#C0A573]/20 mb-12">
          <h2 className="text-3xl font-bold text-[#F0F0F0] mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#C0A573]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#F0F0F0]">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#F0F0F0] mb-3">Enter Your Information</h3>
              <p className="text-[#C0A573]">
                Provide your full name and birth date. This information is used to calculate your unique numerological profile.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#C0A573]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#F0F0F0]">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#F0F0F0] mb-3">Get Your Numbers</h3>
              <p className="text-[#C0A573]">
                Our system calculates your core numbers using traditional numerological methods and algorithms.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#C0A573]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#F0F0F0]">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#F0F0F0] mb-3">Discover Your Path</h3>
              <p className="text-[#C0A573]">
                Receive detailed interpretations and insights about your personality, purpose, and potential.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#F0F0F0] mb-6">Ready to Discover Your Numbers?</h2>
          <p className="text-xl text-[#C0A573] mb-8 max-w-2xl mx-auto">
            Join thousands of others who have unlocked their potential through numerology. 
            Your journey of self-discovery starts here.
          </p>
          <Link
            to="/calculator"
            className="bg-[#C0A573] text-[#2C2A4A] px-12 py-4 rounded-full font-bold text-xl hover:bg-[#D4B885] transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-3"
          >
            <Calculator className="h-6 w-6" />
            <span>Get Your Free Reading</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}