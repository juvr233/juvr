import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  // 获取session_id
  const sessionId = searchParams.get('session_id');
  
  // 倒计时自动跳转
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // 倒计时结束，跳转回主页
      navigate('/');
    }
  }, [countdown, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#1E1E2E] to-[#2A1E5C] rounded-2xl p-8 md:p-12 shadow-xl shadow-purple-900/20 border border-purple-500/30">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">付款成功！</h1>
            <p className="text-lg text-purple-200">
              感谢您的购买。您的灵魂之旅已经解锁新的维度。
            </p>
            
            {sessionId && (
              <div className="mt-4 p-3 bg-purple-900/30 rounded-lg inline-block">
                <p className="text-sm text-purple-300">交易ID: <span className="font-mono text-xs">{sessionId}</span></p>
              </div>
            )}
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <p className="text-white">您现在可以访问高级功能了。服务已激活，有效期为30天。</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center"
            >
              返回首页
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link 
              to="/profile" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-800/50 hover:bg-gray-800/80 rounded-xl text-white font-medium transition-colors"
            >
              查看个人资料
            </Link>
          </div>
          
          <p className="mt-8 text-purple-300 text-sm">
            {countdown}秒后自动返回首页...
          </p>
        </div>
      </div>
    </div>
  );
}
