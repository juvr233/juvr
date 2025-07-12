import express from 'express';
import ShopifyReviewService from '../services/shopify.service';
import { logger } from '../config/logger';

/**
 * 首页数据接口
 */
interface HomePageData {
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

// 创建控制器对象，以匹配路由中的引用方式
export const homeController = {
  /**
   * 获取首页数据
   * @param req 请求对象
   * @param res 响应对象
   */
  getHomePageData: async (req: express.Request, res: express.Response) => {
  try {
    logger.info('获取首页内容');
    
    // 获取最新评价
    const testimonials = await ShopifyReviewService.getLatestReviews(6);
    
    // 获取评价统计
    const reviewStats = await ShopifyReviewService.getReviewStats();
    
    // 构建首页数据
    const homePageData: HomePageData = {
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
      testimonials,
      reviewStats,
      benefits: [
        {
          title: "个性化洞察",
          description: "获取专为您量身定制的深度分析和见解，而不是通用的占星术内容",
          icon: "User"
        },
        {
          title: "科学与神秘的结合",
          description: "我们的方法融合了古老智慧与现代科学理解，提供全面的生命指导",
          icon: "Star"
        },
        {
          title: "即时可用的结果",
          description: "获得即时结果和可操作的洞察，帮助您立即做出更好的决定",
          icon: "Zap"
        },
        {
          title: "隐私保护",
          description: "我们最重视您的隐私，所有个人信息都经过加密并严格保密",
          icon: "Shield"
        },
        {
          title: "专业解读",
          description: "由经验丰富的命理学家和塔罗专家提供深度解读和指导",
          icon: "Award"
        },
        {
          title: "持续支持",
          description: "在您的个人发展旅程中获得持续的指导和支持",
          icon: "Heart"
        }
      ]
    };
    
    // 返回首页数据
    return res.status(200).json(homePageData);
  } catch (error) {
    logger.error(`获取首页内容失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return res.status(500).json({ message: '获取首页内容失败' });
  }
},

  /**
   * 健康检查接口
   * @param req 请求对象
   * @param res 响应对象
   */
  healthCheck: (req: any, res: any) => {
    return res.status(200).json({ status: 'ok', message: 'API服务运行正常' });
  }
};
