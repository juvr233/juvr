import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { ShoppingCart, CreditCard, Lock, CheckCircle } from 'lucide-react';

interface PurchasePageProps {
  returnUrl: string;
}

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: 'tarot' | 'iching';
  featureLevel: 'basic' | 'advanced';
}

export default function PurchasePage({ returnUrl }: PurchasePageProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await paymentAPI.getServices();
        setServices(data);
      } catch (err: any) {
        setError(err.message || '无法加载服务列表');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadServices();
  }, []);
  
  const handlePurchase = async (service: Service) => {
    try {
      setIsProcessing(true);
      setError('');
      setSelectedService(service);
      
      // 创建支付会话
      const response = await paymentAPI.createCheckout(service._id);
      const { url } = response;
      
      // 重定向到Stripe支付页面
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('支付链接不可用');
      }
    } catch (err: any) {
      setError(err.message || '创建支付会话失败');
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-purple-300">正在加载神秘商品目录...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <ShoppingCart className="inline-block mr-2 mb-1" />
            灵魂服务馆
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            解锁高级占卜功能，获取更深层次的精神启示和人生指引。
            每项服务提供30天的无限访问。
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center mb-8">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service._id} 
              className={`rounded-2xl overflow-hidden transition-all duration-300
                ${selectedService?._id === service._id ? 'ring-4 ring-purple-500 transform scale-105' : 
                'border border-purple-800/30 hover:border-purple-600/50 hover:shadow-lg hover:shadow-purple-900/20'}
              `}
            >
              <div className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                  <span className="bg-purple-900/50 text-purple-200 px-3 py-1 rounded-full text-sm">
                    {service.type === 'tarot' ? '塔罗' : '周易'}
                  </span>
                </div>
                <p className="text-gray-300 mb-6 min-h-[80px]">{service.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-white">¥{service.price.toFixed(2)}</span>
                  <span className="text-purple-300 text-sm">30天无限访问</span>
                </div>
                
                <button
                  onClick={() => handlePurchase(service)}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl font-medium text-white transition-colors
                    ${isProcessing && selectedService?._id === service._id
                      ? 'bg-purple-900/50 cursor-wait'
                      : 'bg-purple-600 hover:bg-purple-700'
                    }
                  `}
                >
                  {isProcessing && selectedService?._id === service._id ? (
                    <>
                      <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      正在处理...
                    </>
                  ) : (
                    <>
                      <CreditCard className="inline-block mr-2 mb-1" />
                      购买此服务
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-[#0F3460]/30 px-6 py-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-300">
                      {service.type === 'tarot' 
                        ? '完整的高级塔罗牌阵解读' 
                        : '周易六十四卦完整解读'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-300">30天内无限次数使用</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-300">深层次的个人灵性分析</span>
                  </li>
                  <li className="flex items-start">
                    <Lock className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-300">安全的支付系统</span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {services.length === 0 && !error && !isLoading && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-400">暂无可用服务</p>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Link 
            to={returnUrl} 
            className="inline-block px-6 py-3 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg text-white transition-colors"
          >
            返回继续探索
          </Link>
        </div>
      </div>
    </div>
  );
}
