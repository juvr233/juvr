import React from 'react';
import { User, Calendar, Star, Heart, TrendingUp, Clock, Download } from 'lucide-react';
import { useNumerology } from '../context/NumerologyContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { userProfile } = useNumerology();

  if (!userProfile) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-[#4F4C7A] rounded-3xl p-12 border border-[#C0A573]/20">
            <User className="h-16 w-16 text-[#C0A573] mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#F0F0F0] mb-4">No Profile Found</h1>
            <p className="text-[#C0A573] mb-8">
              You haven't created a numerology profile yet. Get started with a free reading!
            </p>
            <Link
              to="/calculator"
              className="bg-[#C0A573] text-[#2C2A4A] px-8 py-4 rounded-full font-bold hover:bg-[#D4B885] transform hover:scale-105 transition-all duration-300 inline-block"
            >
              Create Your Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { firstName, lastName, birthDate, numerologyProfile, readingHistory } = userProfile;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Profile Header */}
        <div className="bg-[#4F4C7A] rounded-3xl p-8 md:p-12 border border-[#C0A573]/20 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="bg-[#C0A573]/20 w-24 h-24 rounded-3xl flex items-center justify-center">
              <User className="h-12 w-12 text-[#C0A573]" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-[#F0F0F0] mb-2">
                {firstName} {lastName}
              </h1>
              <p className="text-[#C0A573] mb-4 flex items-center justify-center md:justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Born: {new Date(birthDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link
                  to="/results"
                  className="bg-[#2C2A4A] border border-[#C0A573]/30 text-[#F0F0F0] px-6 py-2 rounded-xl hover:bg-[#2C2A4A]/80 transition-all duration-300"
                >
                  View Full Reading
                </Link>
                <button className="bg-[#2C2A4A] border border-[#C0A573]/30 text-[#F0F0F0] px-6 py-2 rounded-xl hover:bg-[#2C2A4A]/80 transition-all duration-300 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Numbers Overview */}
        {numerologyProfile && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-[#4F4C7A] rounded-2xl p-6 border border-[#C0A573]/20 text-center">
              <Star className="h-6 w-6 text-[#C0A573] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#C0A573]">{numerologyProfile.lifePathNumber}</div>
              <div className="text-[#C0A573]/70 text-sm">Life Path</div>
            </div>
            <div className="bg-[#4F4C7A] rounded-2xl p-6 border border-[#C0A573]/20 text-center">
              <User className="h-6 w-6 text-[#C0A573] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#C0A573]">{numerologyProfile.expressionNumber}</div>
              <div className="text-[#C0A573]/70 text-sm">Expression</div>
            </div>
            <div className="bg-[#4F4C7A] rounded-2xl p-6 border border-[#C0A573]/20 text-center">
              <Heart className="h-6 w-6 text-[#C0A573] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#C0A573]">{numerologyProfile.soulUrgeNumber}</div>
              <div className="text-[#C0A573]/70 text-sm">Soul Urge</div>
            </div>
            <div className="bg-[#4F4C7A] rounded-2xl p-6 border border-[#C0A573]/20 text-center">
              <User className="h-6 w-6 text-[#C0A573] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#C0A573]">{numerologyProfile.personalityNumber}</div>
              <div className="text-[#C0A573]/70 text-sm">Personality</div>
            </div>
            <div className="bg-[#4F4C7A] rounded-2xl p-6 border border-[#C0A573]/20 text-center">
              <Calendar className="h-6 w-6 text-[#C0A573] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#C0A573]">{numerologyProfile.birthDayNumber}</div>
              <div className="text-[#C0A573]/70 text-sm">Birth Day</div>
            </div>
            <div className="bg-[#4F4C7A] rounded-2xl p-6 border border-[#C0A573]/20 text-center">
              <TrendingUp className="h-6 w-6 text-[#C0A573] mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#C0A573]">{numerologyProfile.personalYearNumber}</div>
              <div className="text-[#C0A573]/70 text-sm">Personal Year</div>
            </div>
          </div>
        )}

        {/* Numerology Chart */}
        {numerologyProfile && (
          <div className="bg-[#4F4C7A] rounded-3xl p-8 border border-[#C0A573]/20 mb-8">
            <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6 text-center">Your Numerology Chart</h2>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { subject: 'Life Path', value: numerologyProfile.lifePathNumber, fullMark: 9 },
                  { subject: 'Expression', value: numerologyProfile.expressionNumber, fullMark: 9 },
                  { subject: 'Soul Urge', value: numerologyProfile.soulUrgeNumber, fullMark: 9 },
                  { subject: 'Personality', value: numerologyProfile.personalityNumber, fullMark: 9 },
                  { subject: 'Birth Day', value: numerologyProfile.birthDayNumber, fullMark: 9 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 9]} />
                  <Radar name={`${firstName} ${lastName}`} dataKey="value" stroke="#C0A573" fill="#C0A573" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reading History */}
          <div className="lg:col-span-2">
            <div className="bg-[#4F4C7A] rounded-3xl p-8 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-3" />
                Reading History
              </h2>
              
              {readingHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-[#C0A573]/50 mx-auto mb-4" />
                  <p className="text-[#C0A573] mb-6">No reading history yet</p>
                  <Link
                    to="/calculator"
                    className="bg-[#C0A573] text-[#2C2A4A] px-6 py-3 rounded-xl font-semibold hover:bg-[#D4B885] transform hover:scale-105 transition-all duration-300"
                  >
                    Get Your First Reading
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {readingHistory.map((reading) => (
                    <div key={reading.id} className="bg-[#2C2A4A] rounded-2xl p-6 border border-[#C0A573]/10">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-[#F0F0F0] capitalize">
                          {reading.type.replace('-', ' ')}
                        </h3>
                        <span className="text-[#C0A573] text-sm">
                          {new Date(reading.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#C0A573] text-sm mb-4">
                        Complete numerological analysis including life path, expression, and compatibility insights.
                      </p>
                      <button className="text-[#C0A573] hover:text-[#F0F0F0] font-semibold text-sm">
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-[#4F4C7A] rounded-3xl p-8 border border-[#C0A573]/20">
              <h2 className="text-2xl font-bold text-[#F0F0F0] mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/calculator"
                  className="block bg-[#C0A573]/20 text-[#F0F0F0] p-4 rounded-2xl hover:bg-[#C0A573]/30 transform hover:scale-105 transition-all duration-300 text-center"
                >
                  <Star className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-semibold">New Reading</div>
                  <div className="text-sm text-[#C0A573]">Get updated insights</div>
                </Link>
                
                <Link
                  to="/compatibility"
                  className="block bg-[#C0A573]/20 text-[#F0F0F0] p-4 rounded-2xl hover:bg-[#C0A573]/30 transform hover:scale-105 transition-all duration-300 text-center"
                >
                  <Heart className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-semibold">Compatibility Test</div>
                  <div className="text-sm text-[#C0A573]">Test with someone</div>
                </Link>
              </div>
            </div>

            {/* Personal Year Reminder */}
            {numerologyProfile && (
              <div className="bg-[#C0A573]/10 rounded-3xl p-8 border border-[#C0A573]/30">
                <h3 className="text-xl font-bold text-[#F0F0F0] mb-4">
                  Personal Year {numerologyProfile.personalYearNumber}
                </h3>
                <p className="text-[#C0A573] text-sm mb-4">
                  You're currently in a Personal Year {numerologyProfile.personalYearNumber} cycle. 
                  This is a time of {numerologyProfile.personalYearNumber <= 3 ? 'new beginnings and growth' : 
                  numerologyProfile.personalYearNumber <= 6 ? 'building and responsibility' : 'reflection and completion'}.
                </p>
                <div className="text-[#C0A573] font-semibold text-sm">
                  Learn more about your year →
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
