// 星宿占星术 - 中国传统二十八宿

export interface StarInfo {
  mainStar: TwentyEightXiu;
  element: string; // 五行属性
  guardian: string; // 守护神兽
  strengths: string[]; // 性格优势
  challenges: string[]; // 性格挑战
  destiny: string; // 命运展望
  guidance: string; // 指引
  luckyDirections: string[]; // 幸运方位
}

export interface TwentyEightXiu {
  id: number;
  name: string; // 星宿名
  pinyin: string; // 拼音
  group: string; // 所属象限（四象：青龙、白虎、朱雀、玄武）
  element: string; // 五行属性
  direction: string; // 方位
  animal: string; // 对应动物
  strengths: string[]; // 性格优势
  challenges: string[]; // 性格挑战
  destiny: string; // 命运描述
  guidance: string; // 指引
}

// 二十八宿数据
export const TWENTY_EIGHT_XIU: TwentyEightXiu[] = [
  // 东方七宿（青龙）
  {
    id: 1,
    name: "角宿",
    pinyin: "Jiǎo",
    group: "东方青龙",
    element: "木",
    direction: "东",
    animal: "蛟龙",
    strengths: ["领导力强", "有远见", "正直诚实", "创新能力"],
    challenges: ["可能固执", "偏执己见", "过于理想化"],
    destiny: "角宿之人天生具有领导才能，善于开创新局面。一生中有贵人相助，事业上能得到快速发展。特别适合从事管理、教育和创新领域的工作。",
    guidance: "发挥你的创新能力和领导才能，但要学会倾听他人意见，避免过于固执。在做决策时，结合理想与现实，才能取得更大成就。"
  },
  {
    id: 2,
    name: "亢宿",
    pinyin: "Kàng",
    group: "东方青龙",
    element: "木",
    direction: "东",
    animal: "龙",
    strengths: ["思维敏捷", "口才出众", "适应力强", "有感染力"],
    challenges: ["情绪波动大", "可能言过其实", "缺乏耐心"],
    destiny: "亢宿之人聪明伶俐，富有表达能力。能言善辩，受人欢迎。适合从事与交流、演讲、销售相关的工作。但需注意情绪控制，避免因冲动言行带来麻烦。",
    guidance: "利用你的口才和社交能力，但要注意真诚和言行一致。培养耐心和自律，将帮助你在事业上更进一步。"
  },
  {
    id: 3,
    name: "氐宿",
    pinyin: "Dǐ",
    group: "东方青龙",
    element: "土",
    direction: "东",
    animal: "貉",
    strengths: ["稳重踏实", "责任感强", "忠诚可靠", "有韧性"],
    challenges: ["有时优柔寡断", "可能保守", "不善变通"],
    destiny: "氐宿之人踏实稳重，做事有恒心和毅力。一生勤恳，即使面对困难也能坚持不懈。适合长期稳定发展的工作和事业，如公职、管理、规划等领域。",
    guidance: "坚持你的踏实作风，同时培养更多的灵活性和创新思维。学会在适当时候做出改变，会让你的生活和事业更加顺利。"
  },
  {
    id: 4,
    name: "房宿",
    pinyin: "Fáng",
    group: "东方青龙",
    element: "日",
    direction: "东",
    animal: "兔",
    strengths: ["聪明机智", "观察力敏锐", "善于规划", "有创造力"],
    challenges: ["可能多疑", "过于谨慎", "有时优柔寡断"],
    destiny: "房宿之人聪明敏锐，善于观察和分析。具有较强的判断力和规划能力。适合从事需要细心和创造力的工作，如研究、设计、策划等领域。",
    guidance: "发挥你的观察力和分析能力，但要避免过度思考和犹豫不决。相信你的判断，大胆行动，将能够取得更多成就。"
  },
  {
    id: 5,
    name: "心宿",
    pinyin: "Xīn",
    group: "东方青龙",
    element: "火",
    direction: "东",
    animal: "狐",
    strengths: ["洞察力强", "直觉敏锐", "富有同情心", "有智慧"],
    challenges: ["情感波动大", "可能过于敏感", "容易受伤"],
    destiny: "心宿之人富有智慧和同情心，能理解他人感受。有很强的直觉和洞察力。适合从事心理、医疗、咨询、艺术等需要情感理解和表达的工作。",
    guidance: "充分利用你的洞察力和同理心，但要学会保护自己的情感。设立健康的边界，既能帮助他人，也能保持自己的情感健康。"
  },
  {
    id: 6,
    name: "尾宿",
    pinyin: "Wěi",
    group: "东方青龙",
    element: "火",
    direction: "东",
    animal: "虎",
    strengths: ["勇敢无畏", "决断力强", "有正义感", "保护意识强"],
    challenges: ["可能冲动", "固执己见", "不易妥协"],
    destiny: "尾宿之人勇敢果断，正义感强，愿意为弱者挺身而出。具有天生的保护者气质。适合从事需要勇气和决断力的工作，如执法、军事、紧急救援等。",
    guidance: "保持你的勇气和正义感，但要学会控制冲动，增加思考的深度。在关键时刻，冷静的判断比仓促的行动更加重要。"
  },
  {
    id: 7,
    name: "箕宿",
    pinyin: "Jī",
    group: "东方青龙",
    element: "水",
    direction: "东",
    animal: "豹",
    strengths: ["善于交际", "反应迅速", "适应力强", "创新精神"],
    challenges: ["可能不够专注", "缺乏耐心", "易冲动"],
    destiny: "箕宿之人聪明活泼，善于社交，能够快速适应环境变化。具有创新思维和敏捷的反应能力。适合需要活力和社交能力的工作，如公关、媒体、创意行业等。",
    guidance: "充分发挥你的社交能力和创新思维，但要培养恒心和专注力。持之以恒地追求目标，将能够取得更加丰硕的成果。"
  },

  // 北方七宿（玄武）
  {
    id: 8,
    name: "斗宿",
    pinyin: "Dǒu",
    group: "北方玄武",
    element: "土",
    direction: "北",
    animal: "獬",
    strengths: ["判断力强", "公正无私", "有智慧", "有决断力"],
    challenges: ["可能过于严肃", "不易接受异议", "有时固执"],
    destiny: "斗宿之人富有智慧和判断力，处事公正，能够明辨是非。适合从事法律、裁判、评估等需要公正判断的工作。一生中会受到他人尊重，但也可能面临艰难的抉择。",
    guidance: "继续保持你的公正和判断力，但要学会更加包容和灵活。理解不同立场的人，可以帮助你做出更全面的判断。"
  },
  {
    id: 9,
    name: "牛宿",
    pinyin: "Niú",
    group: "北方玄武",
    element: "土",
    direction: "北",
    animal: "牛",
    strengths: ["勤劳踏实", "责任感强", "有毅力", "实际能力强"],
    challenges: ["可能固执", "不善变通", "进展缓慢"],
    destiny: "牛宿之人勤劳踏实，做事有责任心和耐心。即使面对困难也能坚持不懈。适合需要耐心和细致的工作，如农业、手工艺、建筑等实用性领域。一生中通过勤劳获得稳定成就。",
    guidance: "坚持你的勤劳和踏实，同时学会适当放松和调整。接受新思想和方法，将使你的努力更有效率，收获更多成果。"
  },
  {
    id: 10,
    name: "女宿",
    pinyin: "Nǚ",
    group: "北方玄武",
    element: "土",
    direction: "北",
    animal: "蝠",
    strengths: ["细心体贴", "直觉敏锐", "有艺术天赋", "情感丰富"],
    challenges: ["可能多愁善感", "过于敏感", "情绪波动"],
    destiny: "女宿之人富有同情心和艺术天赋，对美有敏锐的感受力。适合从事艺术、设计、护理、教育等需要细腻情感的工作。一生中情感丰富，易受感动，也易受伤害。",
    guidance: "发挥你的艺术才能和细腻情感，但要学会保护自己的心灵。不要让情绪过度影响判断，保持理性和平静，将帮助你更好地表达自己的才华。"
  },
  {
    id: 11,
    name: "虚宿",
    pinyin: "Xū",
    group: "北方玄武",
    element: "水",
    direction: "北",
    animal: "鼠",
    strengths: ["聪明机智", "善于思考", "洞察力强", "适应性好"],
    challenges: ["可能多疑", "犹豫不决", "有时内向"],
    destiny: "虚宿之人聪明灵活，思维敏捷，具有很强的洞察力。适合从事需要思考和分析的工作，如研究、咨询、策划等。一生中能够看透事物本质，但需要决断力来实现目标。",
    guidance: "运用你的智慧和洞察力，同时要学会果断决策。过度思考有时会阻碍行动，相信自己的判断并勇敢前行。"
  },
  {
    id: 12,
    name: "危宿",
    pinyin: "Wēi",
    group: "北方玄武",
    element: "水",
    direction: "北",
    animal: "燕",
    strengths: ["独立自主", "适应力强", "有远见", "创新能力"],
    challenges: ["有时疏远人", "可能不合群", "不易妥协"],
    destiny: "危宿之人独立自主，有远见卓识，不随波逐流。适合从事需要独立思考和创新的工作，如研发、创业、艺术等。一生中会开创自己的道路，但也可能面临孤独的挑战。",
    guidance: "保持你的独立精神和创新思维，同时学会与他人更好地合作。适当的妥协和联盟能帮助你更好地实现远大目标。"
  },
  {
    id: 13,
    name: "室宿",
    pinyin: "Shì",
    group: "北方玄武",
    element: "土",
    direction: "北",
    animal: "猪",
    strengths: ["善于管理", "组织能力强", "实际能力好", "有责任心"],
    challenges: ["可能固执", "不够灵活", "有时刻板"],
    destiny: "室宿之人有很强的组织和管理能力，做事有条理，讲究实际。适合从事管理、行政、规划等需要系统性思维的工作。一生中能够建立稳固的基础，但需要更多创新思维。",
    guidance: "发挥你的组织和管理才能，同时培养更多的创新思维和灵活性。打破常规思考，能够为你带来意想不到的收获。"
  },
  {
    id: 14,
    name: "壁宿",
    pinyin: "Bì",
    group: "北方玄武",
    element: "水",
    direction: "北",
    animal: "貐",
    strengths: ["专注力强", "有毅力", "善于钻研", "忠诚可靠"],
    challenges: ["可能固执", "不够开放", "有时孤僻"],
    destiny: "壁宿之人专注认真，做事有始有终，能够深入钻研。适合从事需要专注和精细的工作，如科研、技术、工艺等领域。一生中能够在某一领域取得深厚成就，但可能缺乏广度。",
    guidance: "保持你的专注和毅力，同时拓宽视野和兴趣范围。全面发展会让你的专业能力更加出色，生活更加丰富多彩。"
  },

  // 西方七宿（白虎）- 补充完整
  {
    id: 15,
    name: "奎宿",
    pinyin: "Kuí",
    group: "西方白虎",
    element: "木",
    direction: "西",
    animal: "狼",
    strengths: ["观察力敏锐", "有战略眼光", "适应力强", "有领导才能"],
    challenges: ["可能过于警惕", "有时多疑", "不易亲近"],
    destiny: "奎宿之人观察力强，有战略眼光，善于规划长远。适合从事需要远见和策略的工作，如管理、规划、投资等领域。一生中会经历挑战，但能通过智慧和适应力克服困难。",
    guidance: "利用你的观察力和战略思维，但要学会更加开放和信任。与他人建立更紧密的联系，将帮助你实现更大的目标。"
  },
  {
    id: 16,
    name: "娄宿",
    pinyin: "Lóu",
    group: "西方白虎",
    element: "金",
    direction: "西",
    animal: "狗",
    strengths: ["忠诚可靠", "正义感强", "有责任心", "善于守护"],
    challenges: ["可能固执", "不善变通", "有时多疑"],
    destiny: "娄宿之人忠诚正直，有强烈的责任感和保护欲。适合从事需要信任和责任的工作，如安保、执法、医疗等。一生中会守护重要的人和事，但需要学会灵活应变。",
    guidance: "珍视你的忠诚和责任感，同时培养更多的灵活性和开放心态。适当调整和变通，会让你的守护更加有效。"
  },
  {
    id: 17,
    name: "胃宿",
    pinyin: "Wèi",
    group: "西方白虎",
    element: "土",
    direction: "西",
    animal: "雉",
    strengths: ["务实能力强", "有耐心", "善于积累", "踏实肯干"],
    challenges: ["可能保守", "不善创新", "进展缓慢"],
    destiny: "胃宿之人踏实稳重，善于积累和经营。适合从事需要长期积累的工作，如农业、商业、制造业等。一生中通过踏实努力获得稳定的成就，但可能缺乏突破性发展。",
    guidance: "继续发挥你的务实和耐心，同时尝试接受新思想和创新方法。适当的冒险和尝试，会为你的稳定发展增添新的活力。"
  },
  {
    id: 18,
    name: "昴宿",
    pinyin: "Mǎo",
    group: "西方白虎",
    element: "金",
    direction: "西",
    animal: "鸡",
    strengths: ["眼光独到", "审美能力强", "善于表现", "有魅力"],
    challenges: ["可能自负", "过于追求完美", "不易满足"],
    destiny: "昴宿之人有独特的审美和表现力，具有天生的魅力。适合从事艺术、表演、设计、时尚等需要美感的工作。一生中能够吸引他人目光，但需要更多实际基础支持。",
    guidance: "发挥你的审美和表现才能，同时培养更多的实际技能和耐心。将才华与努力结合，才能取得持久的成功。"
  },
  {
    id: 19,
    name: "毕宿",
    pinyin: "Bì",
    group: "西方白虎",
    element: "金",
    direction: "西",
    animal: "马",
    strengths: ["精力充沛", "行动力强", "有冒险精神", "直觉敏锐"],
    challenges: ["可能冲动", "缺乏耐心", "不够细致"],
    destiny: "毕宿之人精力充沛，行动迅速，有冒险精神和探索欲望。适合从事需要活力和行动力的工作，如体育、探险、销售等。一生中充满活力和变化，但需要更多的专注和持续力。",
    guidance: "充分利用你的精力和行动力，同时学会更加专注和持久。控制冲动，制定长期计划，将帮助你取得更加持久的成就。"
  },
  {
    id: 20,
    name: "觜宿",
    pinyin: "Zī",
    group: "西方白虎",
    element: "火",
    direction: "西",
    animal: "猴",
    strengths: ["反应灵敏", "灵活多变", "适应力强", "聪明机智"],
    challenges: ["可能多变", "缺乏专注", "易分心"],
    destiny: "觜宿之人聪明灵活，反应迅速，善于应变。适合从事需要灵活思维的工作，如交易、谈判、创意等领域。一生中能够灵活应对各种挑战，但需要更多的专注和坚持。",
    guidance: "发挥你的灵活性和应变能力，同时培养更多的专注力和恒心。选定目标坚持追求，才能将才智转化为实际成就。"
  },
  {
    id: 21,
    name: "参宿",
    pinyin: "Shēn",
    group: "西方白虎",
    element: "金",
    direction: "西",
    animal: "猪",
    strengths: ["有远见", "领导力强", "果断决策", "有魄力"],
    challenges: ["可能独断", "有时强势", "不易接受建议"],
    destiny: "参宿之人有远见卓识和领导才能，能够果断决策并带领他人。适合从事管理、领导、决策等高层次工作。一生中能够掌控大局，但需要更多倾听和包容他人的能力。",
    guidance: "发挥你的远见和领导才能，同时学会更多倾听和接纳不同意见。开放的心态和集体的智慧，将使你的决策更加全面和有效。"
  },

  // 南方七宿（朱雀）- 补充完整
  {
    id: 22,
    name: "井宿",
    pinyin: "Jǐng",
    group: "南方朱雀",
    element: "木",
    direction: "南",
    animal: "犴",
    strengths: ["思维深刻", "有创造力", "善于表达", "富有智慧"],
    challenges: ["可能理想化", "不够实际", "情绪不稳"],
    destiny: "井宿之人思维深刻，有创造力和表达能力。适合从事文学、艺术、哲学、教育等创造性工作。一生中充满灵感和智慧，但需要将想法落地为实际成果。",
    guidance: "发挥你的创造力和表达能力，同时学会更加务实。将抽象的想法转化为具体行动，才能真正实现你的理想和价值。"
  },
  {
    id: 23,
    name: "鬼宿",
    pinyin: "Guǐ",
    group: "南方朱雀",
    element: "水",
    direction: "南",
    animal: "羊",
    strengths: ["直觉敏锐", "洞察力强", "有神秘感", "心思深远"],
    challenges: ["可能太过敏感", "情绪波动", "有时疏离"],
    destiny: "鬼宿之人有极强的直觉和洞察力，能够看透表象。适合从事需要深度思考的工作，如研究、心理、宗教等领域。一生中能够理解深层次的道理，但可能感受过于复杂。",
    guidance: "信任你的直觉和洞察力，但要保持情绪稳定和理性思考。与现实保持良好连接，才能将深刻见解转化为实际帮助。"
  },
  {
    id: 24,
    name: "柳宿",
    pinyin: "Liǔ",
    group: "南方朱雀",
    element: "木",
    direction: "南",
    animal: "獐",
    strengths: ["适应力强", "柔韧性好", "有韧性", "善于沟通"],
    challenges: ["可能缺乏主见", "过于随和", "有时优柔寡断"],
    destiny: "柳宿之人柔韧适应，善于沟通，能够在各种环境中生存。适合从事需要灵活应变的工作，如外交、服务、协调等领域。一生中能够顺应变化，但需要更坚定的立场和方向。",
    guidance: "保持你的柔韧和适应能力，同时建立更加坚定的原则和方向。柔韧不等于没有立场，明确目标将帮助你在变化中保持稳定。"
  },
  {
    id: 25,
    name: "星宿",
    pinyin: "Xīng",
    group: "南方朱雀",
    element: "金",
    direction: "南",
    animal: "马",
    strengths: ["光芒四射", "有影响力", "才华横溢", "善于表现"],
    challenges: ["可能自我中心", "追求关注", "有时浮夸"],
    destiny: "星宿之人光彩照人，有天生的才华和影响力。适合从事需要表现力和感染力的工作，如演艺、媒体、公关等。一生中容易成为焦点，但需要更多的内在充实和真实感。",
    guidance: "发挥你的光彩和才华，同时注重内在修养和真实价值。真正的光芒来自内在的充实，而不仅是外在的表现。"
  },
  {
    id: 26,
    name: "张宿",
    pinyin: "Zhāng",
    group: "南方朱雀",
    element: "木",
    direction: "南",
    animal: "鹿",
    strengths: ["有创造力", "想象力丰富", "善于开拓", "有艺术天赋"],
    challenges: ["可能不切实际", "过于理想化", "有时散漫"],
    destiny: "张宿之人富有创造力和想象力，能够开拓新的领域。适合从事艺术、创意、发明等创新性工作。一生中能够带来新的可能性，但需要更多的计划和执行力。",
    guidance: "充分发挥你的创造力和想象力，同时加强执行力和实际规划。将梦想转化为现实需要坚持不懈的努力和系统的方法。"
  },
  {
    id: 27,
    name: "翼宿",
    pinyin: "Yì",
    group: "南方朱雀",
    element: "火",
    direction: "南",
    animal: "蛇",
    strengths: ["视野开阔", "思维灵活", "善于表达", "有远见"],
    challenges: ["可能散漫", "难以专注", "有时过于理想"],
    destiny: "翼宿之人视野开阔，思想自由，善于从不同角度看问题。适合从事需要广阔思维的工作，如写作、传媒、策划等。一生中能够看到更远的可能性，但需要更多的落地能力。",
    guidance: "保持你开阔的视野和自由的思想，同时培养更多的专注力和执行力。将远见与实践结合，才能真正实现理想。"
  },
  {
    id: 28,
    name: "轸宿",
    pinyin: "Zhěn",
    group: "南方朱雀",
    element: "金",
    direction: "南",
    animal: "乌",
    strengths: ["善于总结", "条理清晰", "有智慧", "深谋远虑"],
    challenges: ["可能过于谨慎", "优柔寡断", "有时保守"],
    destiny: "轸宿之人善于总结和思考，有条理和智慧。适合从事需要整合能力的工作，如学术、研究、管理等。一生中能够积累丰富的知识和经验，但需要更多的行动力和决断力。",
    guidance: "发挥你的智慧和条理性，同时培养更多的决断力和行动力。知识需要通过实践才能转化为真正的智慧，勇于行动是智者的重要品质。"
  }
];

// 计算星宿占星配置
export function calculateStarAstrologyProfile(birthDateTime: Date, gender: string): StarInfo {
  // 根据出生日期时间确定主星宿
  // 这里使用简化算法，实际应根据传统历法和精确算法计算
  const dayOfYear = getDayOfYear(birthDateTime);
  const hourIndex = birthDateTime.getHours();
  const starIndex = (dayOfYear + hourIndex) % 28;
  
  const mainStar = TWENTY_EIGHT_XIU[starIndex] || TWENTY_EIGHT_XIU[0];
  
  // 确定五行属性（这里简化处理，实际需考虑生肖、天干地支等）
  const element = mainStar.element;
  
  // 确定守护神兽
  const guardianMapping: {[key: string]: string} = {
    "东方青龙": "青龙",
    "西方白虎": "白虎",
    "南方朱雀": "朱雀",
    "北方玄武": "玄武"
  };
  
  const guardian = guardianMapping[mainStar.group] || "神龙";
  
  // 确定幸运方位
  const luckyDirections = getLuckyDirections(mainStar, gender);
  
  // 根据性别调整解析内容
  const destinyWithGender = adjustForGender(mainStar.destiny, gender);
  const guidanceWithGender = adjustForGender(mainStar.guidance, gender);
  
  return {
    mainStar,
    element,
    guardian,
    strengths: mainStar.strengths,
    challenges: mainStar.challenges,
    destiny: destinyWithGender,
    guidance: guidanceWithGender,
    luckyDirections
  };
}

// 获取一年中的第几天
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// 获取幸运方位
function getLuckyDirections(star: TwentyEightXiu, gender: string): string[] {
  // 基于星宿和性别确定幸运方位
  const baseDirection = star.direction;
  const oppositeDirections: {[key: string]: string} = {
    "东": "西",
    "西": "东",
    "南": "北",
    "北": "南"
  };
  
  // 阴阳调整
  if (gender === "male") {
    return [baseDirection, getAdjacentDirection(baseDirection, 1)];
  } else {
    return [oppositeDirections[baseDirection], getAdjacentDirection(oppositeDirections[baseDirection], -1)];
  }
}

// 获取相邻方位
function getAdjacentDirection(direction: string, offset: number): string {
  const directions = ["东", "南", "西", "北"];
  const index = directions.indexOf(direction);
  if (index === -1) return "东";
  
  const newIndex = (index + offset + directions.length) % directions.length;
  return directions[newIndex];
}

// 根据性别调整解析文本
function adjustForGender(text: string, gender: string): string {
  if (gender === "male") {
    return text.replace(/他\/她/g, "他").replace(/您/g, "您");
  } else {
    return text.replace(/他\/她/g, "她").replace(/您/g, "您");
  }
}
