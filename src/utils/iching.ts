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

// Line types mapping for calculations
type LineValue = 6 | 7 | 8 | 9; // 6-old yin, 7-young yang, 8-young yin, 9-old yang
type LineConfig = [boolean, boolean, boolean]; // 3 coin configuration

// Helper function to convert binary code to hexagram ID
export function binaryToHexagramId(binary: string): number {
  // In the traditional I Ching order, each hexagram has a specific position
  // This mapping function converts a binary representation to the standard I Ching number
  const traditionalOrder: { [key: string]: number } = {
    "111111": 1, "000000": 2, "100010": 3, "010001": 4, "111010": 5, "010111": 6,
    "010000": 7, "000010": 8, "111011": 9, "110111": 10, "111000": 11, "000111": 12,
    "101111": 13, "111101": 14, "001000": 15, "000100": 16, "100110": 17, "011001": 18,
    "110000": 19, "000011": 20, "100101": 21, "101001": 22, "000001": 23, "100000": 24,
    "100111": 25, "111001": 26, "100001": 27, "011110": 28, "010010": 29, "101101": 30,
    "001110": 31, "011100": 32, "001111": 33, "111100": 34, "000101": 35, "101000": 36,
    "101011": 37, "110101": 38, "001010": 39, "010100": 40, "110001": 41, "100011": 42,
    "111110": 43, "011111": 44, "000110": 45, "011000": 46, "010110": 47, "011010": 48,
    "101110": 49, "011101": 50, "100100": 51, "001001": 52, "001011": 53, "110100": 54,
    "101100": 55, "001101": 56, "011011": 57, "110110": 58, "010011": 59, "110010": 60,
    "110011": 61, "001100": 62, "101010": 63, "010101": 64
  };
  return traditionalOrder[binary] || 1; // Default to Qian if not found
}

// Generate hexagram through traditional coin method
export function generateHexagram(): { hexagram: Hexagram; changingLines: number[]; lineValues: LineValue[] } {
  const lines: HexagramLine[] = [];
  const changingLines: number[] = [];
  const lineValues: LineValue[] = [];
  
  // Binary representation of the hexagram (yang=1, yin=0)
  let binaryCode = "";
  
  // Generate 6 lines using traditional 3-coin method
  for (let i = 0; i < 6; i++) {
    const coins: LineConfig = [
      Math.random() < 0.5, // true = heads(3), false = tails(2)
      Math.random() < 0.5,
      Math.random() < 0.5
    ];
    
    const headsCount = coins.filter(coin => coin).length;
    
    let lineType: 'yin' | 'yang' | 'changing-yin' | 'changing-yang';
    let lineValue: LineValue;
    
    switch (headsCount) {
      case 0: // 3 tails (2+2+2=6) - changing yin (old yin)
        lineType = 'changing-yin';
        lineValue = 6;
        changingLines.push(i + 1);
        binaryCode += "0"; // Yin line (changes to yang)
        break;
      case 1: // 1 head, 2 tails (3+2+2=7) - yang
        lineType = 'yang';
        lineValue = 7;
        binaryCode += "1"; // Yang line
        break;
      case 2: // 2 heads, 1 tail (3+3+2=8) - yin
        lineType = 'yin';
        lineValue = 8;
        binaryCode += "0"; // Yin line
        break;
      case 3: // 3 heads (3+3+3=9) - changing yang (old yang)
        lineType = 'changing-yang';
        lineValue = 9;
        changingLines.push(i + 1);
        binaryCode += "1"; // Yang line (changes to yin)
        break;
      default:
        lineType = 'yin';
        lineValue = 8;
        binaryCode += "0";
    }
    
    lineValues.push(lineValue);
    
    // Find line text from original hexagram if possible
    // This would require a complete database of all line readings
    lines.push({
      position: i + 1,
      type: lineType,
      text: "",
      meaning: ""
    });
  }
  
  // Get the correct hexagram by binary code
  const hexagramId = binaryToHexagramId(binaryCode);
  let selectedHexagram = HEXAGRAMS.find(h => h.id === hexagramId);
  
  // If hexagram not found (in case our database is incomplete), use a default
  if (!selectedHexagram) {
    selectedHexagram = HEXAGRAMS[0]; // Default to first hexagram
  }
  
  // Combine hexagram data with generated lines
  const finalHexagram = { ...selectedHexagram, lines };
  
  return {
    hexagram: finalHexagram,
    changingLines,
    lineValues
  };
}

// Get hexagram by ID
export function getHexagramById(id: number): Hexagram | undefined {
  return HEXAGRAMS.find(hex => hex.id === id);
}

// Generate transformed hexagram from original hexagram and changing lines
export function generateTransformedHexagram(
  originalBinary: string, 
  changingLines: number[]
): Hexagram | undefined {
  if (changingLines.length === 0) return undefined;
  
  // Convert binary string to array for easier manipulation
  const binaryArray = originalBinary.split('');
  
  // Flip each changing line (0->1 or 1->0)
  changingLines.forEach(linePos => {
    // Adjust for zero-indexing
    const index = linePos - 1;
    binaryArray[index] = binaryArray[index] === '0' ? '1' : '0';
  });
  
  // Convert back to string
  const transformedBinary = binaryArray.join('');
  
  // Get the transformed hexagram ID
  const transformedId = binaryToHexagramId(transformedBinary);
  return getHexagramById(transformedId);
}

// Convert hexagram to binary representation
export function hexagramToBinary(hexagram: Hexagram): string {
  let binary = "";
  for (const line of hexagram.lines) {
    binary += line.type.includes('yang') ? "1" : "0";
  }
  return binary;
}

// Generate reading with question context
export function generateIChinReading(question: string): IChinReading {
  const { hexagram, changingLines } = generateHexagram();
  
  // Get binary representation of the original hexagram
  const originalBinary = hexagramToBinary(hexagram);
  
  // Generate transformed hexagram if there are changing lines
  const transformedHexagram = changingLines.length > 0 
    ? generateTransformedHexagram(originalBinary, changingLines) 
    : undefined;
  
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