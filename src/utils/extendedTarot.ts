// 扩展的塔罗牌解读系统
// 提供更丰富、多面向的塔罗牌解析，适用于AI深度解读

export interface ExtendedTarotMeaning {
  // 基础象征意义
  symbolism: string[];
  // 元素和占星关联
  elements: {
    element?: string;
    astrologicalSign?: string;
    planet?: string;
    numerologicalAssociation: number;
  };
  // 不同领域的含义
  domains: {
    love: {
      general: string;
      single: string;
      relationship: string;
      challenges: string;
      opportunities: string;
    };
    career: {
      general: string;
      strengths: string;
      challenges: string;
      opportunities: string;
      advice: string;
    };
    spirituality: {
      general: string;
      lessons: string;
      growth: string;
      practices: string;
    };
    health: {
      physical: string;
      mental: string;
      energetic: string;
      advice: string;
    };
    finances: {
      general: string;
      opportunities: string;
      challenges: string;
      advice: string;
    };
  };
  // 深层心理学意义
  psychology: {
    jungianArchetype: string;
    shadowAspects: string;
    integration: string;
    unconsciousInfluences: string;
  };
  // 历史和文化背景
  history: {
    origins: string;
    culturalPerspectives: string;
    evolutionOfMeaning: string;
  };
  // 正逆位情绪指南
  emotionalGuidance: {
    upright: string[];
    reversed: string[];
  };
  // 关键词语
  keywords: {
    upright: string[];
    reversed: string[];
  };
  // 禅修和自我反思问题
  reflectionQuestions: string[];
  // 与其他牌的关系
  combinations: {
    enhancedBy: number[]; // 增强当前牌意义的牌ID
    challenged: number[]; // 与当前牌产生张力的牌ID
    complementary: number[]; // 补充当前牌意义的牌ID
  };
}

// 为主要牌阵提供的扩展解读
export interface SpreadPositionMeaning {
  positionName: string;
  generalMeaning: string;
  questionPrompts: string[];
  interpretation: {
    past: string;
    present: string;
    future: string;
  };
}

// 塔罗牌阵的扩展解读
export const TAROT_SPREAD_POSITIONS: Record<string, SpreadPositionMeaning[]> = {
  "three-card": [
    {
      positionName: "过去",
      generalMeaning: "影响当前情境的过去事件、经验或能量",
      questionPrompts: [
        "哪些过去的经历正在影响我现在的状况？",
        "我过去的哪些模式正在重演？",
        "我需要从过去学习什么？"
      ],
      interpretation: {
        past: "这张牌代表更远的过去对现在的影响，可能揭示根源性问题",
        present: "这张牌显示过去如何直接塑造了你目前的处境",
        future: "这张牌提示过去的模式可能如何影响未来，需要解决的历史问题"
      }
    },
    {
      positionName: "现在",
      generalMeaning: "当前情境、挑战或机遇的核心能量",
      questionPrompts: [
        "我现在面临的核心挑战是什么？",
        "现在什么能量最强烈地影响着我？",
        "我需要对当前情况保持什么态度？"
      ],
      interpretation: {
        past: "过去如何直接导致了现在的情况",
        present: "这是你当前状态的最准确反映，表示主导能量",
        future: "当前的态度和行动如何直接影响即将到来的未来"
      }
    },
    {
      positionName: "未来",
      generalMeaning: "潜在的结果、即将到来的能量或未来的可能性",
      questionPrompts: [
        "我的情况可能向什么方向发展？",
        "我需要为未来做什么准备？",
        "我能如何积极地影响未来的结果？"
      ],
      interpretation: {
        past: "过去的模式如何可能在未来重复",
        present: "当前的行动如何直接塑造这个可能的未来",
        future: "这张牌揭示潜在结果或即将到来的能量，但记住未来始终可以改变"
      }
    }
  ],
  "celtic-cross": [
    {
      positionName: "当前状况",
      generalMeaning: "代表询问者当前的状态或处境的核心问题",
      questionPrompts: [
        "什么是我现在最需要关注的?",
        "我当前的心态如何影响我的处境？",
        "我的核心挑战是什么？"
      ],
      interpretation: {
        past: "过去的经验如何形成了当前的挑战",
        present: "这张牌直接反映你现在的状态和能量",
        future: "当前的状况可能如何演变"
      }
    },
    {
      positionName: "交叉/挑战",
      generalMeaning: "当前面临的挑战、障碍或可能的支持力量",
      questionPrompts: [
        "什么正在阻碍或支持我？",
        "我需要克服什么困难？",
        "什么是我没有看到的潜在资源？"
      ],
      interpretation: {
        past: "过去的挑战如何影响当前的障碍",
        present: "这是你目前面对的主要阻力或推动力",
        future: "这个挑战可能如何转变"
      }
    },
    // 更多celtic-cross位置解释...
  ]
};

// 扩展塔罗牌解读数据库 - 主要牌例子
export const EXTENDED_TAROT_MEANINGS: Record<number, ExtendedTarotMeaning> = {
  0: { // 愚人
    symbolism: [
      "新的开始",
      "纯真与自发",
      "冒险与跳跃",
      "无限可能",
      "信任生命过程"
    ],
    elements: {
      element: "风",
      planet: "天王星",
      numerologicalAssociation: 0
    },
    domains: {
      love: {
        general: "愚人在爱情中代表新的开始、自发性和冒险。它鼓励你以开放的心态和不受以往经验影响的纯真去体验爱情。",
        single: "对单身者来说，愚人暗示可能有一段令人兴奋的新恋情即将开始。保持开放的心态，不要让过去的恐惧阻碍你。",
        relationship: "在现有关系中，这张牌鼓励重新注入新鲜感和自发性。一起尝试新事物，像初次相遇时那样彼此探索。",
        challenges: "可能存在的挑战是轻率决策或回避承诺。确保你的自发性不会导致不负责任的行为。",
        opportunities: "这是一个尝试新方法、打破老套路并重新发现伴侣魅力的绝佳时机。"
      },
      career: {
        general: "在职业方面，愚人代表新的开始、创新思维和愿意冒险。",
        strengths: "创造力、适应性、乐观态度和对新可能性的开放。",
        challenges: "可能缺乏规划或准备不足；有时可能看起来不够专业或不够严肃。",
        opportunities: "新的工作机会、创业、职业转变或创新项目。",
        advice: "保持开放的态度，但确保在踏上新道路前进行一些基本规划。相信你的直觉，但不要忽视实际细节。"
      },
      spirituality: {
        general: "在精神旅程中，愚人代表纯粹的信任和向未知敞开心扉。它是灵性探索的初始阶段。",
        lessons: "学习信任宇宙的引导，放下对结果的执着，享受灵性探索的旅程。",
        growth: "通过直接体验而不是知识学习来成长；拥抱生活的神秘和不确定性。",
        practices: "冥想、即兴式灵修活动、大自然徒步、信任练习和放下控制的练习。"
      },
      health: {
        physical: "活力和自然健康；可能需要注意不要在体育活动中冒不必要的风险。",
        mental: "思维自由，不受限制；可能需要一些接地练习来平衡飘忽的想法。",
        energetic: "能量充沛且流动自如；容易接收灵感和创造性冲动。",
        advice: "在保持活力的同时建立健康的日常习惯；将自发性与自我关爱平衡。"
      },
      finances: {
        general: "愚人在财务上表示新的财务开始或机会，但也警告潜在的轻率。",
        opportunities: "创新的收入来源、非传统投资或创业机会。",
        challenges: "可能缺乏财务规划或冲动消费；对风险的不切实际评估。",
        advice: "保持财务上的冒险精神，但建立基本的安全网；在大投资前做研究。"
      }
    },
    psychology: {
      jungianArchetype: "天真的孩子原型，代表纯真、好奇和对世界的开放态度",
      shadowAspects: "逃避责任、自我欺骗、对现实的幼稚理解、拒绝成长",
      integration: "将愚人能量整合意味着在保持开放和自发的同时承担适当的责任",
      unconsciousInfluences: "可能反映对自由的潜意识渴望或对结构的叛逆"
    },
    history: {
      origins: "愚人在中世纪的表现通常是弄臣或宫廷小丑，象征着超越社会规范的人物",
      culturalPerspectives: "在不同文化中，这种角色常被视为接近神圣的存在，因为他们能说出常人不敢说的真相",
      evolutionOfMeaning: "随着时间的推移，愚人从纯粹的傻瓜形象演变为代表精神探索初始阶段的象征"
    },
    emotionalGuidance: {
      upright: [
        "信任直觉",
        "拥抱不确定性",
        "保持好奇",
        "放下恐惧",
        "享受当下"
      ],
      reversed: [
        "重新评估风险",
        "审视逃避模式",
        "培养责任感",
        "平衡自由与结构",
        "注意行动的后果"
      ]
    },
    keywords: {
      upright: ["新开始", "自发性", "纯真", "冒险", "自由", "潜力", "理想主义", "开放态度"],
      reversed: ["轻率", "冒险", "愚蠢的风险", "不负责任", "缺乏方向", "延迟", "选择困难"]
    },
    reflectionQuestions: [
      "我现在生活中需要更多的自发性和冒险吗？",
      "我在哪些方面可能过于谨慎，阻碍了潜在的成长？",
      "我如何能更信任自己的直觉和人生旅程？",
      "有什么行李（实际或情感上的）我需要放下才能前进？",
      "我现在面临的'悬崖'是什么，需要我勇敢跳跃？"
    ],
    combinations: {
      enhancedBy: [17, 19, 21], // 星星、太阳、世界
      challenged: [4, 15, 16],  // 皇帝、魔鬼、塔
      complementary: [1, 6, 7]  // 魔术师、恋人、战车
    }
  },
  // 可以继续添加更多牌的扩展解读...
};

// 根据牌ID获取扩展解读
export function getExtendedTarotMeaning(cardId: number): ExtendedTarotMeaning | undefined {
  return EXTENDED_TAROT_MEANINGS[cardId];
}

// 根据牌阵类型和位置获取位置解读
export function getSpreadPositionMeaning(
  spreadType: string, 
  position: number
): SpreadPositionMeaning | undefined {
  const positions = TAROT_SPREAD_POSITIONS[spreadType];
  if (!positions || position >= positions.length) {
    return undefined;
  }
  return positions[position];
}

// AI解读时牌组合的综合分析
export function analyzeCardCombination(
  cards: number[],
  question: string
): string {
  // 简单示例，实际实现应更复杂
  const elementCounts = {fire: 0, water: 0, air: 0, earth: 0};
  const arcanaTypes = {major: 0, minor: 0};
  let majorThemes = [];
  
  // 这里添加实际的分析逻辑
  // ...
  
  return "基于这些牌的组合，主要能量是... [AI综合分析结果]";
}
