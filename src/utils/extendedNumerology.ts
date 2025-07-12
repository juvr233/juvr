// 扩展的命理数字解释

export interface ExtendedNumberInterpretation {
  love: {
    strengths: string[];
    challenges: string[];
    advice: string;
  };
  career: {
    strengths: string[];
    challenges: string[];
    advice: string;
  };
  friendship: {
    strengths: string[];
    challenges: string[];
    advice: string;
  };
  values: string[];
  communication: {
    style: string;
    strengths: string[];
    challenges: string[];
  };
}

export const EXTENDED_NUMBER_INTERPRETATIONS: Record<number, ExtendedNumberInterpretation> = {
  1: {
    love: {
      strengths: ["强大的保护欲", "决断力", "鼓励伴侣成长"],
      challenges: ["缺乏耐心", "可能过于主导", "不愿妥协"],
      advice: "学习倾听和分享决策，给予伴侣独立的空间。"
    },
    career: {
      strengths: ["领导能力", "决策力", "先驱意识"],
      challenges: ["独断专行", "不善团队合作", "固执"],
      advice: "学习团队合作和授权的技巧，接受并评估他人的想法。"
    },
    friendship: {
      strengths: ["忠诚", "诚实直接", "勇敢"],
      challenges: ["可能过于自我", "缺乏耐心", "不善表达情感"],
      advice: "练习倾听和表达感激之情，尊重朋友的意见和感受。"
    },
    values: ["成就", "自主", "独立", "创新", "勇气"],
    communication: {
      style: "直接、简洁、目标导向",
      strengths: ["表达清晰", "直言不讳", "决断"],
      challenges: ["可能显得武断", "不耐烦", "不注意细节"]
    }
  },
  2: {
    love: {
      strengths: ["敏感体贴", "情感丰富", "和平调解者"],
      challenges: ["过度依赖", "情绪化", "害怕冲突"],
      advice: "建立健康的界限，学习表达个人需求，不要害怕适当的冲突。"
    },
    career: {
      strengths: ["团队合作", "外交能力", "细节关注"],
      challenges: ["决策犹豫", "过度敏感", "回避冲突"],
      advice: "培养自信和决断力，学会接受建设性批评，不要过度担心他人看法。"
    },
    friendship: {
      strengths: ["忠诚", "善解人意", "情感支持"],
      challenges: ["可能过度迁就", "难以设界", "情绪依赖"],
      advice: "学习设立健康界限，不要总是将自己的需求置于最后。"
    },
    values: ["和谐", "合作", "平衡", "关怀", "敏感"],
    communication: {
      style: "温和、外交、注重情感",
      strengths: ["善于倾听", "情感共鸣", "和谐协调"],
      challenges: ["避免直接冲突", "可能不表达真实感受", "过于担心他人反应"]
    }
  },
  3: {
    love: {
      strengths: ["表达能力强", "热情", "创意十足"],
      challenges: ["可能不稳定", "分散注意力", "情绪波动"],
      advice: "培养持久性和一致性，学会专注于关系的深度而非广度。"
    },
    career: {
      strengths: ["创造力", "表达能力", "乐观积极"],
      challenges: ["缺乏组织", "注意力分散", "拖延"],
      advice: "制定清晰的目标和时间表，培养纪律性和完成项目的能力。"
    },
    friendship: {
      strengths: ["有趣活泼", "社交能力强", "慷慨"],
      challenges: ["可能表面化", "过度承诺", "不稳定"],
      advice: "发展深度关系，学习专注和倾听，培养持续的友谊。"
    },
    values: ["表达", "创造", "快乐", "社交", "乐观"],
    communication: {
      style: "活泼、表达丰富、情感化",
      strengths: ["生动形象", "幽默风趣", "鼓舞人心"],
      challenges: ["可能主导对话", "分散注意力", "不注重细节"]
    }
  },
  4: {
    love: {
      strengths: ["稳定可靠", "忠诚", "实际支持"],
      challenges: ["可能过于死板", "不善表达情感", "工作狂"],
      advice: "学习表达情感和灵活性，为关系和休闲时间创造空间。"
    },
    career: {
      strengths: ["组织能力", "可靠", "勤奋"],
      challenges: ["抗拒变化", "固执", "过度工作"],
      advice: "学习适应变化和新思路，在工作和生活之间找到平衡。"
    },
    friendship: {
      strengths: ["忠诚可靠", "诚实", "实际帮助"],
      challenges: ["可能缺乏灵活性", "不善表达", "过于严肃"],
      advice: "学习放松和享受时刻，不要总是关注任务和责任。"
    },
    values: ["秩序", "稳定", "可靠", "诚实", "勤奋"],
    communication: {
      style: "实际、直接、基于事实",
      strengths: ["清晰准确", "可靠", "有条理"],
      challenges: ["可能过于简短", "缺乏情感表达", "过于批判"]
    }
  },
  5: {
    love: {
      strengths: ["冒险精神", "活力", "适应性强"],
      challenges: ["可能不稳定", "害怕承诺", "追求刺激"],
      advice: "学习建立稳定性和深度，找到平衡自由和承诺的方式。"
    },
    career: {
      strengths: ["适应能力", "沟通技巧", "多才多艺"],
      challenges: ["难以专注", "厌倦常规", "缺乏耐心"],
      advice: "设定明确的目标，培养专注力和持久性，珍视经验的积累。"
    },
    friendship: {
      strengths: ["有趣", "适应性强", "开放思想"],
      challenges: ["可能难以定期联系", "过于分散", "难以长期承诺"],
      advice: "保持稳定的联系，培养深度关系，不要总是寻求新鲜感。"
    },
    values: ["自由", "变化", "探索", "冒险", "多样性"],
    communication: {
      style: "多变、生动、探索性",
      strengths: ["适应不同场合", "有说服力", "思维敏捷"],
      challenges: ["可能跳跃话题", "过于啰嗦", "难以聚焦"]
    }
  },
  6: {
    love: {
      strengths: ["奉献", "责任感", "关怀"],
      challenges: ["控制欲", "过度牺牲", "理想化"],
      advice: "学习设立健康界限，接受伴侣的不完美，照顾自己的需求。"
    },
    career: {
      strengths: ["负责任", "调和", "服务精神"],
      challenges: ["完美主义", "过度承担", "工作家庭平衡"],
      advice: "学习委派任务，避免过度责任感，设置合理的期望。"
    },
    friendship: {
      strengths: ["关怀支持", "负责任", "可靠"],
      challenges: ["可能过度参与", "提供未经请求的建议", "期望回报"],
      advice: "学习尊重界限，允许朋友犯错和学习，不要总是扮演救援者。"
    },
    values: ["责任", "和谐", "家庭", "爱", "平衡"],
    communication: {
      style: "关怀、协调、支持性",
      strengths: ["善于倾听", "给予建议", "和谐"],
      challenges: ["可能说教", "过度关心", "难以直接表达不满"]
    }
  },
  7: {
    love: {
      strengths: ["深度", "智慧", "独立"],
      challenges: ["情感距离", "过度分析", "难以表达"],
      advice: "学习分享内心世界，不要害怕情感上的亲密，建立信任。"
    },
    career: {
      strengths: ["分析能力", "专注", "独立工作"],
      challenges: ["与团队融合", "过度思考", "批判性"],
      advice: "培养与同事的联系，分享想法，平衡分析与行动。"
    },
    friendship: {
      strengths: ["深度", "忠诚", "智慧建议"],
      challenges: ["可能疏远", "需要独处", "难以表达情感"],
      advice: "积极保持联系，分享你的内心世界，不要过度退缩。"
    },
    values: ["知识", "真理", "内省", "智慧", "独立"],
    communication: {
      style: "思考性、深度、分析性",
      strengths: ["深度思考", "洞察力", "倾听能力"],
      challenges: ["可能过于安静", "难以表达情感", "过度分析"]
    }
  },
  8: {
    love: {
      strengths: ["稳定", "保护", "目标导向"],
      challenges: ["工作重于关系", "控制欲", "情感距离"],
      advice: "学习平衡工作与个人生活，表达情感，分享脆弱面。"
    },
    career: {
      strengths: ["领导力", "组织能力", "实际性"],
      challenges: ["可能专制", "难以授权", "过度工作"],
      advice: "培养团队精神，学习授权，平衡成就与个人满足。"
    },
    friendship: {
      strengths: ["忠诚", "可信赖", "慷慨"],
      challenges: ["可能支配", "难以表达情感", "期望回报"],
      advice: "学习平等对待朋友，表达关心而非控制，培养情感连接。"
    },
    values: ["成功", "力量", "物质安全", "效率", "实用主义"],
    communication: {
      style: "权威、直接、基于结果",
      strengths: ["清晰", "有说服力", "目标明确"],
      challenges: ["可能过于主导", "不耐烦", "忽略情感因素"]
    }
  },
  9: {
    love: {
      strengths: ["理解", "包容", "无私"],
      challenges: ["情感距离", "理想主义", "难以表达个人需求"],
      advice: "学习表达个人需求，设立健康界限，保持现实期望。"
    },
    career: {
      strengths: ["创造力", "人道主义", "激励他人"],
      challenges: ["缺乏实际性", "不专注于细节", "难以接受批评"],
      advice: "培养组织能力，学习接受反馈，平衡理想与实际。"
    },
    friendship: {
      strengths: ["慷慨", "包容", "支持"],
      challenges: ["可能难以亲近", "情感疏离", "期望过高"],
      advice: "学习表达个人需求，培养更深层次的联系，不要害怕亲密。"
    },
    values: ["人道主义", "同情", "无私", "理想主义", "普世爱"],
    communication: {
      style: "启发性、包容、理想主义",
      strengths: ["启发他人", "善于倾听", "包容"],
      challenges: ["可能过于笼统", "不切实际", "不直接"]
    }
  },
  11: {
    love: {
      strengths: ["直觉", "精神联系", "高度敏感"],
      challenges: ["过度敏感", "理想化", "情绪波动"],
      advice: "培养情感稳定性，接受现实的不完美，学习设立健康界限。"
    },
    career: {
      strengths: ["直觉力", "创新思维", "激励能力"],
      challenges: ["难以融入常规", "情绪敏感", "过高期望"],
      advice: "将创新理念转化为实际步骤，学习接受反馈和批评。"
    },
    friendship: {
      strengths: ["灵性连接", "理解", "支持"],
      challenges: ["可能情绪不稳", "期望过高", "难以适应表面关系"],
      advice: "接受友谊的不同层次，培养情绪稳定性，设立健康界限。"
    },
    values: ["灵性", "启蒙", "理想主义", "直觉", "创新"],
    communication: {
      style: "直觉性、精神性、灵感型",
      strengths: ["洞察力", "富有启发", "同理心"],
      challenges: ["可能难以理解", "过于抽象", "情感波动"]
    }
  },
  22: {
    love: {
      strengths: ["稳定", "实际支持", "建设性"],
      challenges: ["工作压力大", "责任感过重", "情感距离"],
      advice: "平衡大目标和个人关系，学习表达情感和脆弱。"
    },
    career: {
      strengths: ["远见", "组织能力", "实现大目标"],
      challenges: ["压力大", "完美主义", "难以放松"],
      advice: "学习授权和团队合作，接受阶段性成功，不要过度要求自己。"
    },
    friendship: {
      strengths: ["可靠", "有指导能力", "慷慨"],
      challenges: ["可能控制", "缺乏轻松", "期望高"],
      advice: "学习享受友谊的轻松时刻，不要总是关注目标和成就。"
    },
    values: ["愿景", "实用性", "建设", "大规模影响", "稳固性"],
    communication: {
      style: "实际、构建性、有远见",
      strengths: ["清晰思考", "有说服力", "鼓舞人心"],
      challenges: ["可能过于复杂", "难以理解", "不够耐心"]
    }
  }
};
