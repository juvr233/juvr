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
        setError(err.message || 'Failed to load service list');
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
      
      // Create a payment session
      const response = await paymentAPI.createCheckout(service._id);
      const { url } = response;
      
      // Redirect to the Stripe payment page
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Payment link is not available');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create payment session');
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-purple-300">Loading the mystical goods catalog...</p>
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
            Soul Service Hall
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Unlock advanced divination functions to obtain deeper spiritual enlightenment and life guidance.
            Each service provides 30 days of unlimited access.
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
                    {service.type === 'tarot' ? 'Tarot' : 'I Ching'}
                  </span>
                </div>
                <p className="text-gray-300 mb-6 min-h-[80px]">{service.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-white">¥{service.price.toFixed(2)}</span>
                  <span className="text-purple-300 text-sm">30-day unlimited access</span>
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="inline-block mr-2 mb-1" />
                      Purchase this service
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
                        ? 'Complete advanced Tarot spread interpretation' 
                        : 'Complete interpretation of the 64 hexagrams of the I Ching'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Unlimited use within 30 days</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-300">In-depth personal spiritual analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Lock className="text-yellow-400 h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Secure payment system</span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {services.length === 0 && !error && !isLoading && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-400">No services available at the moment</p>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Link 
            to={returnUrl} 
            className="inline-block px-6 py-3 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg text-white transition-colors"
          >
            Return to continue exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
