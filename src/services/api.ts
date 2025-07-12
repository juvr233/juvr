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

// Feedback response interfaces
interface FeedbackResponse {
  success: boolean;
  message: string;
  feedback: {
    _id: string;
    userId: string;
    readingId: string;
    readingType: string;
    rating: number;
    comment?: string;
    helpful?: boolean;
    accurate?: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface FeedbackStatsResponse {
  success: boolean;
  stats: {
    averageRating: number;
    totalCount: number;
    ratingDistribution: Array<{
      _id: number;
      count: number;
    }>;
    helpfulPercentage: number;
    accuratePercentage: number;
  };
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

// 首页API响应类型
interface HomePageResponse {
  welcomeMessage: string;
  featuredServices: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    link: string;
    buttonText: string;
  }>;
  testimonials: Array<{
    id: string;
    author: string;
    rating: number;
    content: string;
    date: string;
    verified: boolean;
    serviceType?: string;
  }>;
  reviewStats: {
    total: number;
    averageRating: number;
  };
  benefits: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

// 命理数据相关的类型
interface DivinationRecord {
  _id: string;
  user: string;
  type: 'numerology' | 'tarot' | 'iching' | 'compatibility' | 'holistic' | 'starAstrology' | 'bazi';
  data: any;
  title: string;
  description?: string;
  date: string;
  isFavorite: boolean;
  tags?: string[];
  sharedWith?: string[];
  isPublic?: boolean;
}

interface DivinationResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: DivinationRecord[];
}

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 创建axios实例
export const api = axios.create({
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
    return api.post('/auth/register', userData) as Promise<AuthResponse>;
  },
  
  // 用户登录
  login: async (credentials: { email: string, password: string }) => {
    const response = await api.post('/auth/login', credentials) as AuthResponse;
    // 存储token和用户数据
    if (response && response.token) {
      localStorage.setItem('userToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response));
    }
    return response;
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

// 首页相关API
export const homeAPI = {
  // 获取首页内容
  getHomePageContent: async () => {
    return await api.get<HomePageResponse>('/home') as unknown as HomePageResponse;
  },
  
  // 与后端接口保持一致的方法命名
  getHomePageData: async () => {
    return await api.get<HomePageResponse>('/home') as unknown as HomePageResponse;
  },
  
  // 获取备用的静态首页数据（当API不可用时使用）
  getFallbackHomeData: () => {
    return {
      welcomeMessage: "探索您的命运轨迹，揭示隐藏的天赋与机遇，点亮心灵旅程。",
      featuredServices: [
        {
          id: "numerology",
          title: "命理数字分析",
          description: "通过古老的数字学智慧，基于您的出生日期和姓名，发现您的核心生命目的、天赋和命运之路。",
          icon: "Calculator",
          link: "/calculator",
          buttonText: "开始分析"
        },
        {
          id: "tarot",
          title: "塔罗牌解读",
          description: "通过古老的塔罗牌智慧，获得关于您过去、现在和未来可能性的神秘指引。探索内心世界和潜在命运。",
          icon: "Zap",
          link: "/tarot?cards=3",
          buttonText: "开始解读"
        },
        {
          id: "iching",
          title: "周易卦象",
          description: "通过古老的周易智慧获得深刻的见解和指导。64卦揭示命运的流动和变化的力量。",
          icon: "BookOpen",
          link: "/zhouyi",
          buttonText: "咨询周易"
        },
        {
          id: "compatibility",
          title: "兼容性分析",
          description: "了解您与伴侣、朋友或同事之间的兼容性。分析数字能量如何相互作用并影响您的关系。",
          icon: "Users",
          link: "/compatibility",
          buttonText: "检测兼容性"
        }
      ],
      testimonials: [
        {
          id: "1",
          author: "李明",
          rating: 5,
          content: "命理分析非常准确，几乎说中了我所有的性格特点和职业倾向。强烈推荐！",
          date: "2025-06-15",
          verified: true,
          serviceType: "numerology"
        },
        {
          id: "2",
          author: "张华",
          rating: 4,
          content: "塔罗牌解读给我提供了很多有价值的见解，帮助我做出了重要决定。",
          date: "2025-06-10",
          verified: true,
          serviceType: "tarot"
        }
      ],
      reviewStats: {
        total: 150,
        averageRating: 4.7
      },
      benefits: [
        {
          title: "个性化洞察",
          description: "获取专为您量身定制的深度分析和见解",
          icon: "User"
        },
        {
          title: "科学与神秘的结合",
          description: "融合古老智慧与现代科学理解",
          icon: "Star"
        },
        {
          title: "即时可用的结果",
          description: "获得即时结果和可操作的洞察",
          icon: "Zap"
        }
      ]
    };
  }
};

// 命理数据相关API
export const divinationAPI = {
  // 创建命理记录
  createRecord: async (record: {
    type: 'numerology' | 'tarot' | 'iching' | 'compatibility' | 'holistic' | 'starAstrology' | 'bazi';
    data: any;
    title: string;
    description?: string;
    tags?: string[];
  }) => {
    return await api.post<{success: boolean; data: DivinationRecord}>('/divination', record);
  },
  
  // 获取所有命理记录
  getRecords: async (params?: {
    type?: string;
    page?: number;
    limit?: number;
    sort?: string;
    tags?: string[];
    favorite?: boolean;
    search?: string;
  }) => {
    return await api.get<DivinationResponse>('/divination', { params });
  },
  
  // 获取单个命理记录详情
  getRecordDetail: async (id: string) => {
    return await api.get<{success: boolean; data: DivinationRecord}>(`/divination/${id}`);
  },
  
  // 更新命理记录
  updateRecord: async (id: string, updates: {
    title?: string;
    description?: string;
    data?: any;
    tags?: string[];
    isFavorite?: boolean;
  }) => {
    return await api.put<{success: boolean; data: DivinationRecord}>(`/divination/${id}`, updates);
  },
  
  // 删除命理记录
  deleteRecord: async (id: string) => {
    return await api.delete<{success: boolean; message: string}>(`/divination/${id}`);
  },
  
  // 分享命理记录
  shareRecord: async (id: string, sharing: {
    userIds?: string[];
    isPublic?: boolean;
  }) => {
    return await api.post<{success: boolean; message: string; data: DivinationRecord}>(`/divination/${id}/share`, sharing);
  },
  
  // 获取共享的命理记录
  getSharedRecords: async (params?: {
    page?: number;
    limit?: number;
  }) => {
    return await api.get<DivinationResponse>('/divination/shared', { params });
  },
  
  // 获取命理统计数据
  getStats: async () => {
    return await api.get<{
      success: boolean;
      data: {
        typeStats: Record<string, number>;
        recentRecords: DivinationRecord[];
        favoritesCount: number;
        totalRecords: number;
      }
    }>('/divination/stats');
  }
};

// 命理计算API
export const divinationCalculateAPI = {
  // 实时计算数字学
  calculateNumerology: async (params: {
    birthDate: string;
    name?: string;
  }) => {
    return await api.post<{success: boolean; data: any}>('/divination/calculate/numerology', params);
  },
  
  // 实时生成塔罗牌解读
  generateTarotReading: async (params: {
    spread: string;
    cards: Array<{
      name: string;
      position: string;
      isReversed: boolean;
      image?: string;
    }>;
    question?: string;
  }) => {
    return await api.post<{success: boolean; data: any}>('/divination/calculate/tarot', params);
  },
  
  // 实时生成易经解读
  generateIChingReading: async (params?: {
    question?: string;
  }) => {
    return await api.post<{success: boolean; data: any}>('/divination/calculate/iching', params || {});
  },
  
  // 实时计算兼容性分析
  calculateCompatibility: async (params: {
    person1: { name?: string; birthDate: string };
    person2: { name?: string; birthDate: string };
  }) => {
    return await api.post<{success: boolean; data: any}>('/divination/calculate/compatibility', params);
  },
  
  // 实时生成综合命理分析
  generateHolisticReading: async (params: {
    birthDate: string;
    numerology?: any;
    tarot?: any;
    iChing?: any;
    bazi?: any;
    starAstrology?: any;
  }) => {
    return await api.post<{success: boolean; data: any}>('/divination/calculate/holistic', params);
  }
};

// 添加反馈相关API
export const feedbackAPI = {
  // 提交反馈
  submitFeedback: async (feedbackData: {
    readingId: string;
    readingType: string;
    rating: number;
    comment?: string;
    helpful?: boolean;
    accurate?: boolean;
  }) => {
    return api.post('/feedback', feedbackData) as Promise<FeedbackResponse>;
  },
  
  // 获取反馈统计
  getFeedbackStats: async (readingType: string) => {
    return api.get(`/feedback/stats/${readingType}`) as Promise<FeedbackStatsResponse>;
  },
  
  // 获取特定阅读的反馈
  getFeedbackForReading: async (readingId: string) => {
    return api.get(`/feedback/reading/${readingId}`);
  },
};

export default api;
