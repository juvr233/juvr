import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XCircle, ArrowRight } from 'lucide-react';

export default function PaymentCancelPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  // 倒计时自动跳转
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // 倒计时结束，跳转回主页
      navigate('/purchase');
    }
  }, [countdown, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#1E1E2E] to-[#301E2E] rounded-2xl p-8 md:p-12 shadow-xl shadow-purple-900/20 border border-red-500/30">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">付款已取消</h1>
            <p className="text-lg text-purple-200">
              您的订单未完成。如果您遇到任何问题，请随时联系我们的客户支持。
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">您可能想要：</h3>
              <ul className="text-gray-300 text-left pl-6 list-disc">
                <li>重新尝试购买</li>
                <li>选择其他支付方式</li>
                <li>浏览其他可用服务</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/purchase" 
              className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center"
            >
              返回购买页面
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link 
              to="/" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-800/50 hover:bg-gray-800/80 rounded-xl text-white font-medium transition-colors"
            >
              返回首页
            </Link>
          </div>
          
          <p className="mt-8 text-purple-300 text-sm">
            {countdown}秒后自动返回购买页面...
          </p>
        </div>
      </div>
    </div>
  );
}
