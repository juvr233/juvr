import axios from 'axios';

// 定义API响应类型
interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

interface VerifyPurchaseResponse {
  hasPurchased: boolean;
  message: string;
}

interface CheckoutSessionResponse {
  id: string;
  url: string;
}

interface TarotReadingResponse {
  success: boolean;
  spreadType: 'three' | 'five' | 'ten';
  reading: {
    overall: string;
    cards: Array<{
      position: string;
      card: { id: number; reversed: boolean };
      interpretation: string;
    }>;
  };
}

interface IChingReadingResponse {
  success: boolean;
  hexagram: number;
  reading: {
    name: string;
    chinese: string;
    description: string;
    overall: string;
    detailed: string;
  };
}

interface PaidService {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  type: 'tarot' | 'iching';
  featureLevel: 'basic' | 'advanced';
  isActive: boolean;
}

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 401错误 - 未授权/token过期
    if (error.response && error.response.status === 401) {
      // 清除本地token
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      
      // 可以在这里添加重定向到登录页的逻辑
      window.location.href = '/login';
    }
    
    // 返回统一格式的错误信息
    return Promise.reject({
      message: error.response?.data?.message || '发生错误，请稍后再试',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// 用户认证相关API
export const authAPI = {
  // 用户注册
  register: async (userData: { username: string, email: string, password: string }) => {
    return await api.post('/auth/register', userData);
  },
  
  // 用户登录
  login: async (credentials: { email: string, password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    // 存储token和用户数据
    if (response && (response as unknown as AuthResponse).token) {
      const authResponse = response as unknown as AuthResponse;
      localStorage.setItem('userToken', authResponse.token);
      localStorage.setItem('userData', JSON.stringify(authResponse));
    }
    return response as unknown as AuthResponse;
  },
  
  // 获取用户资料
  getProfile: async () => {
    return await api.get('/auth/profile');
  },
  
  // 退出登录
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  },
  
  // 检查是否已登录
  isAuthenticated: () => {
    return localStorage.getItem('userToken') !== null;
  },
  
  // 获取当前用户数据
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
};

// 支付相关API
export const paymentAPI = {
  // 获取所有付费服务
  getServices: async () => {
    return await api.get<PaidService[]>('/payments/services') as unknown as PaidService[];
  },
  
  // 创建支付会话
  createCheckout: async (serviceId: string) => {
    return await api.post<CheckoutSessionResponse>('/payments/create-checkout-session', { serviceId }) as unknown as CheckoutSessionResponse;
  },
  
  // 验证用户是否已购买服务
  verifyPurchase: async (serviceSlug: string) => {
    return await api.get<VerifyPurchaseResponse>(`/payments/verify/${serviceSlug}`) as unknown as VerifyPurchaseResponse;
  }
};

// 塔罗牌相关API
export const tarotAPI = {
  // 检查用户访问权限
  checkAccess: async (spreadType: 'five' | 'ten') => {
    return await api.get<{access: boolean}>(`/tarot/access/${spreadType}`) as unknown as {access: boolean};
  },
  
  // 获取塔罗牌解读
  getReading: async (
    spreadType: 'three' | 'five' | 'ten',
    cards: { id: number, reversed: boolean }[]
  ) => {
    return await api.post<TarotReadingResponse>(`/tarot/reading/${spreadType}`, { cards }) as unknown as TarotReadingResponse;
  }
};

// 周易相关API
export const ichingAPI = {
  // 检查用户访问权限
  checkAccess: async () => {
    return await api.get<{access: boolean}>('/iching/access') as unknown as {access: boolean};
  },
  
  // 获取周易卦象解读
  getReading: async (hexagram: number) => {
    return await api.post<IChingReadingResponse>('/iching/reading', { hexagram }) as unknown as IChingReadingResponse;
  }
};

export default api;
