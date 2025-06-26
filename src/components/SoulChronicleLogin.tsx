import { useState } from 'react';
import { User, BookOpen, Sparkles, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';
import { authAPI } from '../services/api';

interface SoulChronicleLoginProps {
  onLoginSuccess: (userData: { 
    sacredName: string; 
    isReturning: boolean;
    token?: string;
    email?: string;
    _id?: string;
  }) => void;
  onCancel: () => void;
}

export default function SoulChronicleLogin({ onLoginSuccess, onCancel }: SoulChronicleLoginProps) {
  const [isReturning, setIsReturning] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAwakening, setIsAwakening] = useState(false);
  const [error, setError] = useState('');

  const handleSoulAwakening = async () => {
    setError('');
    
    // Validation
    if (!formData.username.trim()) {
      setError('Sacred Name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Ethereal address (Email) is required');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Soul Essence Key is required');
      return;
    }
    
    if (!isReturning && formData.password !== formData.confirmPassword) {
      setError('Soul Essence Keys do not match');
      return;
    }
    
    if (!isReturning && formData.password.length < 6) {
      setError('Soul Essence Key must be at least 6 characters');
      return;
    }
    
    setIsAwakening(true);
    
    try {
      // 根据是否是返回用户调用不同的API
      let userData;
      
      if (isReturning) {
        // 登录
        userData = await authAPI.login({
          email: formData.email.trim(),
          password: formData.password
        });
      } else {
        // 注册
        userData = await authAPI.register({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password
        });
      }
      
      // 登录成功
      onLoginSuccess({
        sacredName: userData.username || formData.username.trim(),
        isReturning: isReturning || false,
        token: userData.token,
        email: userData.email,
        _id: userData._id
      });
    } catch (err: any) {
      setError(err.message || '灵魂连接失败，请再次尝试');
    } finally {
      setIsAwakening(false);
    }
  };

  // Initial threshold - choosing path
  if (isReturning === null) {
    return (        <div className="flex items-center justify-center z-50">
        <div className="w-[650px]">
          {/* Ancient Door/Book Visual */}
          <div className="bg-gradient-to-br from-[#101118] via-[#22232E] to-[#101118] rounded-3xl p-12 border border-[#8A2BE2]/30 shadow-2xl relative">
            
            {/* Mystical Background Effects */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#8A2BE2] rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FF00FF] rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Sacred Book/Door Symbol */}
            <div className="relative z-10 text-center mb-12">
              <div className="relative">
                <div className="bg-gradient-to-br from-[#8A2BE2]/30 to-[#8A2BE2]/10 w-32 h-32 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse border border-[#8A2BE2]/40">
                  <BookOpen className="h-16 w-16 text-[#8A2BE2]" />
                </div>
                {/* Floating mystical particles */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 text-[#8A2BE2] animate-ping"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1.5 + Math.random()}s`
                      }}
                    >
                      ✨
                    </div>
                  ))}
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-[#8A2BE2] mb-6 tracking-wide">
                Act I: The Knocking
              </h2>
              <h3 className="text-2xl font-bold text-[#FFFFFF] mb-8 italic">
                Calling the Soul's Name
              </h3>
              
              <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent mx-auto mb-8"></div>
              
              <p className="text-[#A0A0A0] text-lg leading-relaxed italic max-w-xl mx-auto mb-8">
                "You stand before the first threshold of the sanctuary. The ancient chronicles await your presence, 
                ready to record every divination and every insight on your sacred journey."
              </p>
            </div>

            {/* Path Selection */}
            <div className="relative z-10 space-y-6">
              <h4 className="text-xl font-bold text-[#FFFFFF] text-center mb-8">
                Choose Your Sacred Path
              </h4>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Returning Seeker */}
                <button
                  onClick={() => setIsReturning(true)}
                  className="bg-[#22232E]/70 hover:bg-[#8A2BE2]/20 border border-[#8A2BE2]/30 hover:border-[#8A2BE2]/60 rounded-2xl p-8 text-left transition-all duration-500 group transform hover:scale-105"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <User className="h-8 w-8 text-[#8A2BE2] group-hover:scale-110 transition-transform" />
                    <h5 className="text-xl font-bold text-[#FFFFFF] group-hover:text-[#8A2BE2] transition-colors">
                      Returning Seeker
                    </h5>
                  </div>
                  <p className="text-[#A0A0A0] leading-relaxed italic">
                    "The corridor of time and space has recorded your footprints. 
                    Whisper the Sacred Name you once left behind, and let us open your Chronicle of Destiny again."
                  </p>
                </button>

                {/* First-time Seeker */}
                <button
                  onClick={() => setIsReturning(false)}
                  className="bg-[#22232E]/70 hover:bg-[#8A2BE2]/20 border border-[#8A2BE2]/30 hover:border-[#8A2BE2]/60 rounded-2xl p-8 text-left transition-all duration-500 group transform hover:scale-105"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <Sparkles className="h-8 w-8 text-[#8A2BE2] group-hover:scale-110 transition-transform" />
                    <h5 className="text-xl font-bold text-[#FFFFFF] group-hover:text-[#8A2BE2] transition-colors">
                      First-time Traveler
                    </h5>
                  </div>
                  <p className="text-[#A0A0A0] leading-relaxed italic">
                    "Welcome, lost traveler. Before embarking on this journey, 
                    please give your soul a Sacred Name and create your Soul Essence Key for future visits."
                  </p>
                </button>
              </div>
            </div>

            {/* Sacred Footer */}
            <div className="relative z-10 text-center mt-12">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent mx-auto mb-4"></div>
              <p className="text-[#A0A0A0] text-sm italic">
                "Every soul needs a name and key to be remembered by the universe"
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Soul Chronicle Awakening Form
  return (      <div className="flex items-center justify-center z-50">
      <div className="w-[650px]">
        <div className="bg-gradient-to-br from-[#101118] via-[#22232E] to-[#101118] rounded-3xl p-12 border border-[#8A2BE2]/30 shadow-2xl relative">
          
          {/* Mystical Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#8A2BE2] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FF00FF] rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Chronicle Symbol */}
          <div className="relative z-10 text-center mb-12">
            <div className="relative">
              <div className="bg-gradient-to-br from-[#8A2BE2]/30 to-[#8A2BE2]/10 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse border border-[#8A2BE2]/40">
                <BookOpen className="h-12 w-12 text-[#8A2BE2]" />
              </div>
              {/* Energy particles */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 text-[#8A2BE2] animate-ping"
                    style={{
                      top: `${30 + Math.random() * 40}%`,
                      left: `${30 + Math.random() * 40}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1.5 + Math.random()}s`
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-[#8A2BE2] mb-4 tracking-wide">
              {isReturning ? 'Chronicle Awakening' : 'Soul Chronicle Creation'}
            </h2>
            
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent mx-auto mb-6"></div>
          </div>

          {/* Sacred Guidance Text */}
          <div className="relative z-10 mb-8">
            <div className="bg-[#101118]/50 rounded-2xl p-6 border border-[#8A2BE2]/20">
              <p className="text-[#A0A0A0] text-lg leading-relaxed italic text-center">
                {isReturning 
                  ? "\"The corridor of time and space has recorded your footprints. Whisper the Sacred Name and Soul Essence Key you once left behind, let us open your Chronicle of Destiny again.\""
                  : "\"Welcome, lost traveler. Before embarking on this journey, please give your soul a Sacred Name and create a Soul Essence Key. These will become your eternal marks in the spiritual world.\""
                }
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="relative z-10 mb-6">
              <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4">
                <p className="text-red-400 text-center italic">"{error}"</p>
              </div>
            </div>
          )}

          {/* Sacred Form */}
          <div className="relative z-10 space-y-6">
            {/* Username/Sacred Name Input */}
            <div>
              <label className="block text-[#FFFFFF] font-semibold mb-3 text-lg">
                <User className="inline h-5 w-5 mr-2" />
                {isReturning ? 'Your Sacred Name (Username)' : 'Choose Your Sacred Name (Username)'}
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-6 py-4 h-16 rounded-2xl bg-[#101118]/70 border border-[#8A2BE2]/30 text-[#FFFFFF] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent text-lg"
                placeholder={isReturning ? "Enter your sacred name..." : "Create your sacred name..."}
                autoComplete="username"
              />
              <p className="text-[#A0A0A0] text-sm mt-2 italic">
                {isReturning 
                  ? "The name that echoes through your spiritual journey"
                  : "This name will be your eternal identifier in the mystical realm"
                }
              </p>
            </div>
            
            {/* Email Input */}
            <div>
              <label className="block text-[#FFFFFF] font-semibold mb-3 text-lg">
                <BookOpen className="inline h-5 w-5 mr-2" />
                {isReturning ? 'Your Ethereal Address (Email)' : 'Set Your Ethereal Address (Email)'}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-6 py-4 h-16 rounded-2xl bg-[#101118]/70 border border-[#8A2BE2]/30 text-[#FFFFFF] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent text-lg"
                placeholder={isReturning ? "Enter your ethereal address..." : "Create your ethereal address..."}
                autoComplete="email"
              />
              <p className="text-[#A0A0A0] text-sm mt-2 italic">
                {isReturning 
                  ? "The ethereal channel through which we shall commune"
                  : "This address will be used to reconnect with your spiritual journey"
                }
              </p>
            </div>

            {/* Password/Soul Essence Key Input */}
            <div>
              <label className="block text-[#FFFFFF] font-semibold mb-3 text-lg">
                <Lock className="inline h-5 w-5 mr-2" />
                {isReturning ? 'Soul Essence Key (Password)' : 'Create Soul Essence Key (Password)'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-6 py-4 h-16 rounded-2xl bg-[#101118]/70 border border-[#8A2BE2]/30 text-[#FFFFFF] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent text-lg pr-14"
                  placeholder={isReturning ? "Enter your soul essence key..." : "Create your soul essence key..."}
                  autoComplete={isReturning ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8A2BE2] hover:text-[#FFFFFF] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-[#A0A0A0] text-sm mt-2 italic">
                {isReturning 
                  ? "The secret key that unlocks your personal chronicle"
                  : "Minimum 6 characters - this key will protect your sacred chronicle"
                }
              </p>
            </div>

            {/* Confirm Password (for new users only) */}
            {!isReturning && (
              <div>
                <label className="block text-[#FFFFFF] font-semibold mb-3 text-lg">
                  <Lock className="inline h-5 w-5 mr-2" />
                  Confirm Soul Essence Key
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-6 py-4 h-16 rounded-2xl bg-[#101118]/70 border border-[#8A2BE2]/30 text-[#FFFFFF] placeholder-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] focus:border-transparent text-lg pr-14"
                    placeholder="Confirm your soul essence key..."
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8A2BE2] hover:text-[#FFFFFF] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-[#A0A0A0] text-sm mt-2 italic">
                  "Confirm your sacred key to ensure its power is true"
                </p>
              </div>
            )}

            {/* Sacred Purpose Statement */}
            <div className="bg-gradient-to-br from-[#8A2BE2]/10 to-[#8A2BE2]/5 rounded-2xl p-6 border border-[#8A2BE2]/20">
              <h4 className="text-lg font-bold text-[#8A2BE2] mb-3 italic text-center">
                Sacred Purpose
              </h4>
              <p className="text-[#FFFFFF]/90 text-center leading-relaxed">
                {isReturning 
                  ? "We invite you to awaken your Soul Chronicle - your personal sacred scroll that records every divination and every insight from your spiritual journey."
                  : "Your Soul Chronicle will become a sacred repository of all your divinations, insights, and spiritual revelations. This is not mere data storage, but a continuation of your unique destiny trajectory."
                }
              </p>
            </div>

            {/* Awakening Button */}
            <button
              onClick={handleSoulAwakening}
              disabled={isAwakening || !formData.username.trim() || !formData.password.trim() || (!isReturning && !formData.confirmPassword.trim())}
              className="w-full h-20 bg-gradient-to-r from-[#8A2BE2] to-[#FF00FF] text-[#FFFFFF] font-bold py-6 px-8 rounded-2xl hover:from-[#FF00FF] hover:to-[#8A2BE2] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xl"
            >
              {isAwakening ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-[#FFFFFF] border-t-transparent"></div>
                  <span>{isReturning ? 'Awakening Chronicle...' : 'Creating Soul Chronicle...'}</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#FFFFFF] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#FFFFFF] rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-[#FFFFFF] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <BookOpen className="h-6 w-6" />
                  <span>{isReturning ? 'Awaken My Chronicle' : 'Create My Soul Chronicle'}</span>
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </button>

            {/* Back to Path Selection */}
            <div className="text-center">
              <button
                onClick={() => setIsReturning(null)}
                className="text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors text-sm italic mr-6"
              >
                "Choose a different path..."
              </button>
              <button
                onClick={onCancel}
                className="text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors text-sm italic"
              >
                "Perhaps another time, when the soul is ready..."
              </button>
            </div>
          </div>

          {/* Sacred Footer */}
          <div className="relative z-10 text-center mt-8">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent mx-auto mb-4"></div>
            <p className="text-[#A0A0A0] text-xs italic">
              "Your sacred information is protected by ancient mystical encryption"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}