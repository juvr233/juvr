// I Ching (Zhouyi) Hexagram System
// Ancient Chinese divination and wisdom system

export interface Hexagram {
  id: number;
  name: string;
  chineseName: string;
  trigrams: {
    upper: string;
    lower: string;
  };
  judgment: string;
  image: string;
  interpretation: {
    explanation: string;
    revelation: string;
    guidance: string;
  };
  lines: HexagramLine[];
}

export interface HexagramLine {
  position: number;
  type: 'yin' | 'yang' | 'changing-yin' | 'changing-yang';
  text: string;
  meaning: string;
}

export interface IChinReading {
  hexagram: Hexagram;
  changingLines: number[];
  transformedHexagram?: Hexagram;
  question: string;
  timestamp: string;
}

// The 64 Hexagrams of the I Ching
export const HEXAGRAMS: Hexagram[] = [
  {
    id: 1,
    name: "Qian",
    chineseName: "乾",
    trigrams: { upper: "Heaven", lower: "Heaven" },
    judgment: "The Creative works sublime success, furthering through perseverance.",
    image: "Heaven moves vigorously. The superior man makes himself strong and untiring.",
    interpretation: {
      explanation: "Qian represents the creative force of the universe, pure yang energy. It symbolizes strength, leadership, and the power to initiate. Like the dragon rising to the heavens, this hexagram speaks of great potential and the ability to achieve remarkable things through persistent effort.",
      revelation: "The key to your current situation lies in taking initiative and leadership. You possess the creative power to manifest your vision into reality. This is a time for bold action and confident decision-making.",
      guidance: "Embrace your role as a leader and creator. Trust in your abilities and take decisive action. However, remember that true strength comes with responsibility - use your power wisely and for the benefit of all."
    },
    lines: [
      { position: 1, type: 'yang', text: "Hidden dragon. Do not act.", meaning: "Potential is present but not yet ready to manifest" },
      { position: 2, type: 'yang', text: "Dragon appearing in the field. It furthers one to see the great man.", meaning: "Emerging influence, seek guidance from wise mentors" },
      { position: 3, type: 'yang', text: "All day long the superior man is creatively active. At nightfall his mind is still beset with cares. Danger. No blame.", meaning: "Constant vigilance and effort required" },
      { position: 4, type: 'yang', text: "Wavering flight over the depths. No blame.", meaning: "Careful consideration before major decisions" },
      { position: 5, type: 'yang', text: "Flying dragon in the heavens. It furthers one to see the great man.", meaning: "Peak of power and influence, time for great achievements" },
      { position: 6, type: 'yang', text: "Arrogant dragon will have cause to repent.", meaning: "Warning against overreach and arrogance" }
    ]
  },
  {
    id: 15,
    name: "Qian",
    chineseName: "謙",
    trigrams: { upper: "Earth", lower: "Mountain" },
    judgment: "Modesty creates success. The superior man carries things through.",
    image: "Within the earth, a mountain. The superior man reduces that which is too much and augments that which is too little.",
    interpretation: {
      explanation: "The hexagram Qian symbolizes modesty and humility. Although the mountain is tall, it is beneath the earth, representing the virtue of humility. With the virtue of modesty, everything can prosper. If a gentleman can maintain humility from beginning to end, there will be good results.",
      revelation: "The key to your current question is 'humility'. Be cautious and listen to others' opinions with an open mind. Put yourself in a low position, and you can take charge of the overall situation and gain support. Not relying on success and not taking credit for achievements are the core of how to behave in this stage.",
      guidance: "Practice genuine humility in all your dealings. True strength lies not in domination but in service. By placing others' needs before your own and remaining modest despite your achievements, you create the conditions for lasting success and harmony."
    },
    lines: [
      { position: 1, type: 'yin', text: "A modest superior man. It is favorable to cross the great water.", meaning: "Humility at the beginning brings good fortune" },
      { position: 2, type: 'yin', text: "Modesty that comes to expression. Perseverance brings good fortune.", meaning: "Genuine humility is recognized and rewarded" },
      { position: 3, type: 'yang', text: "A superior man of modesty and merit carries things to conclusion. Good fortune.", meaning: "Humble competence leads to completion" },
      { position: 4, type: 'yin', text: "Nothing that would not further modesty in movement.", meaning: "All actions benefit from humble approach" },
      { position: 5, type: 'yin', text: "No boasting of wealth before one's neighbor. It is favorable to attack with force.", meaning: "Modest strength can overcome arrogance" },
      { position: 6, type: 'yin', text: "Modesty that comes to expression. It is favorable to set armies marching to chastise one's own city and one's country.", meaning: "Self-correction through humble reflection" }
    ]
  },
  // Additional hexagrams would be added here...
  // For brevity, I'm including just these two as examples
];

// Trigram definitions
export const TRIGRAMS = {
  "Heaven": { symbol: "☰", element: "Metal", attribute: "Creative" },
  "Earth": { symbol: "☷", element: "Earth", attribute: "Receptive" },
  "Thunder": { symbol: "☳", element: "Wood", attribute: "Arousing" },
  "Water": { symbol: "☵", element: "Water", attribute: "Abysmal" },
  "Mountain": { symbol: "☶", element: "Earth", attribute: "Keeping Still" },
  "Wind": { symbol: "☴", element: "Wood", attribute: "Gentle" },
  "Fire": { symbol: "☲", element: "Fire", attribute: "Clinging" },
  "Lake": { symbol: "☱", element: "Metal", attribute: "Joyous" }
};

// Generate hexagram through traditional coin method
export function generateHexagram(): { hexagram: Hexagram; changingLines: number[] } {
  const lines: HexagramLine[] = [];
  const changingLines: number[] = [];
  
  // Generate 6 lines using traditional 3-coin method
  for (let i = 0; i < 6; i++) {
    const coins = [Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5];
    const heads = coins.filter(coin => coin).length;
    
    let lineType: 'yin' | 'yang' | 'changing-yin' | 'changing-yang';
    
    switch (heads) {
      case 0: // 3 tails - changing yin (old yin)
        lineType = 'changing-yin';
        changingLines.push(i + 1);
        break;
      case 1: // 2 tails, 1 head - yang
        lineType = 'yang';
        break;
      case 2: // 1 tail, 2 heads - yin
        lineType = 'yin';
        break;
      case 3: // 3 heads - changing yang (old yang)
        lineType = 'changing-yang';
        changingLines.push(i + 1);
        break;
      default:
        lineType = 'yin';
    }
    
    lines.push({
      position: i + 1,
      type: lineType,
      text: "",
      meaning: ""
    });
  }
  
  // For simplicity, we'll use a basic mapping to select hexagrams
  // In a full implementation, this would calculate based on trigram combinations
  const hexagramIndex = Math.floor(Math.random() * HEXAGRAMS.length);
  const selectedHexagram = { ...HEXAGRAMS[hexagramIndex], lines };
  
  return {
    hexagram: selectedHexagram,
    changingLines
  };
}

// Get hexagram by ID
export function getHexagramById(id: number): Hexagram | undefined {
  return HEXAGRAMS.find(hex => hex.id === id);
}

// Generate reading with question context
export function generateIChinReading(question: string): IChinReading {
  const { hexagram, changingLines } = generateHexagram();
  
  let transformedHexagram: Hexagram | undefined;
  if (changingLines.length > 0) {
    // In a full implementation, this would calculate the transformed hexagram
    // For now, we'll use a simple approach
    const transformedIndex = (hexagram.id % HEXAGRAMS.length);
    transformedHexagram = HEXAGRAMS[transformedIndex];
  }
  
  return {
    hexagram,
    changingLines,
    transformedHexagram,
    question,
    timestamp: new Date().toISOString()
  };
}

// Question guidance for users
export const QUESTION_GUIDANCE = {
  examples: [
    "What are the prospects for job hunting in the near future?",
    "Is this business cooperation feasible?",
    "How should I approach this relationship challenge?",
    "What is the best way to handle this family situation?",
    "Should I make this major life change now?",
    "How can I improve my current financial situation?",
    "What approach should I take with this difficult decision?",
    "How can I better understand my life purpose?"
  ],
  principles: [
    "One question per consultation - focus brings clarity",
    "Be specific and sincere in your inquiry",
    "Ask about approach and timing rather than yes/no questions",
    "Frame questions about your own actions and choices",
    "Seek guidance on 'how' rather than 'what will happen'"
  ]
};