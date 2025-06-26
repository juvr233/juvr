import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';

interface PremiumFeatureProps {
  serviceSlug: string;
  onPurchaseRequired: () => void;
  onAccessGranted: () => void;
  children: React.ReactNode;
}

export default function PremiumFeature({ 
  serviceSlug, 
  onPurchaseRequired, 
  onAccessGranted,
  children 
}: PremiumFeatureProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // 检查用户是否已购买该服务
        const result = await paymentAPI.verifyPurchase(serviceSlug);
        
        if (result && result.hasPurchased) {
          setHasAccess(true);
          onAccessGranted();
        } else {
          setHasAccess(false);
          onPurchaseRequired();
        }
      } catch (err: any) {
        setError(err.message || '无法验证访问权限');
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // 只有当用户已登录时才检查访问权限
    const token = localStorage.getItem('userToken');
    if (token) {
      checkAccess();
    } else {
      setHasAccess(false);
      onPurchaseRequired();
      setIsLoading(false);
    }
  }, [serviceSlug, onPurchaseRequired, onAccessGranted]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px] text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-purple-300">正在验证灵魂权限...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
        <p className="text-red-400 text-lg">出现了一些问题：{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-red-700/50 hover:bg-red-700/70 rounded-lg text-white transition-colors"
        >
          重试
        </button>
      </div>
    );
  }
  
  // 如果用户有权访问，则显示内容
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // 没有访问权限时，不渲染内容
  return null;
}
