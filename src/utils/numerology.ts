// Numerology calculation utilities

export interface NumerologyProfile {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthDayNumber: number;
  personalYearNumber: number;
}

export interface NumberInterpretation {
  number: number;
  title: string;
  description: string;
  strengths: string[];
  challenges: string[];
  careerPaths: string[];
  compatibility: number[];
}

// Letter to number mapping for Pythagorean numerology
const LETTER_VALUES: { [key: string]: number } = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

const VOWELS = 'AEIOU';

/**
 * Reduces a number to a single digit or master number (11, 22, 33)
 */
export function reduceToSingleDigit(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

/**
 * Calculates the Life Path Number from birth date
 * Expected format: MM/DD/YYYY or YYYY-MM-DD (converts to MM/DD/YYYY)
 */
export function calculateLifePath(birthDate: string): number {
  let month: number, day: number, year: number;
  
  if (birthDate.includes('-')) {
    // Convert from YYYY-MM-DD to MM/DD/YYYY format
    const [yearStr, monthStr, dayStr] = birthDate.split('-');
    month = parseInt(monthStr);
    day = parseInt(dayStr);
    year = parseInt(yearStr);
  } else if (birthDate.includes('/')) {
    // Already in MM/DD/YYYY format
    const [monthStr, dayStr, yearStr] = birthDate.split('/');
    month = parseInt(monthStr);
    day = parseInt(dayStr);
    year = parseInt(yearStr);
  } else {
    // Fallback: treat as digits only
    const digits = birthDate.replace(/\D/g, '');
    const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    return reduceToSingleDigit(sum);
  }
  
  // Calculate using month + day + year
  const sum = month + day + year;
  return reduceToSingleDigit(sum);
}

/**
 * Calculates Expression Number from full name
 */
export function calculateExpression(fullName: string): number {
  const sum = fullName.toUpperCase().split('').reduce((acc, letter) => {
    return acc + (LETTER_VALUES[letter] || 0);
  }, 0);
  return reduceToSingleDigit(sum);
}

/**
 * Calculates Soul Urge Number from vowels in name
 */
export function calculateSoulUrge(fullName: string): number {
  const vowelSum = fullName.toUpperCase().split('').reduce((acc, letter) => {
    return VOWELS.includes(letter) ? acc + (LETTER_VALUES[letter] || 0) : acc;
  }, 0);
  return reduceToSingleDigit(vowelSum);
}

/**
 * Calculates Personality Number from consonants in name
 */
export function calculatePersonality(fullName: string): number {
  const consonantSum = fullName.toUpperCase().split('').reduce((acc, letter) => {
    return /[A-Z]/.test(letter) && !VOWELS.includes(letter) ? acc + (LETTER_VALUES[letter] || 0) : acc;
  }, 0);
  return reduceToSingleDigit(consonantSum);
}

/**
 * Calculates Birth Day Number
 * Handles both YYYY-MM-DD and MM/DD/YYYY formats
 */
export function calculateBirthDay(birthDate: string): number {
  let day: number;
  
  if (birthDate.includes('-')) {
    // YYYY-MM-DD format
    day = parseInt(birthDate.split('-')[2]) || 1;
  } else if (birthDate.includes('/')) {
    // MM/DD/YYYY format
    day = parseInt(birthDate.split('/')[1]) || 1;
  } else {
    // Fallback
    day = 1;
  }
  
  return reduceToSingleDigit(day);
}

/**
 * Calculates Personal Year Number
 * Handles both YYYY-MM-DD and MM/DD/YYYY formats
 */
export function calculatePersonalYear(birthDate: string, year?: number): number {
  const currentYear = year || new Date().getFullYear();
  let month: number, day: number;
  
  if (birthDate.includes('-')) {
    // YYYY-MM-DD format
    const [, monthStr, dayStr] = birthDate.split('-');
    month = parseInt(monthStr);
    day = parseInt(dayStr);
  } else if (birthDate.includes('/')) {
    // MM/DD/YYYY format
    const [monthStr, dayStr] = birthDate.split('/');
    month = parseInt(monthStr);
    day = parseInt(dayStr);
  } else {
    // Fallback
    month = 1;
    day = 1;
  }
  
  const sum = month + day + currentYear;
  return reduceToSingleDigit(sum);
}

/**
 * Gets complete numerology profile
 */
export function getNumerologyProfile(firstName: string, lastName: string, birthDate: string): NumerologyProfile {
  const fullName = `${firstName} ${lastName}`;
  
  return {
    lifePathNumber: calculateLifePath(birthDate),
    expressionNumber: calculateExpression(fullName),
    soulUrgeNumber: calculateSoulUrge(fullName),
    personalityNumber: calculatePersonality(fullName),
    birthDayNumber: calculateBirthDay(birthDate),
    personalYearNumber: calculatePersonalYear(birthDate)
  };
}

/**
 * Number interpretations database
 */
export const NUMBER_INTERPRETATIONS: { [key: number]: NumberInterpretation } = {
  1: {
    number: 1,
    title: "The Leader",
    description: "Independent, pioneering, and ambitious. Natural born leaders who forge their own path.",
    strengths: ["Leadership", "Independence", "Innovation", "Determination", "Originality"],
    challenges: ["Impatience", "Selfishness", "Stubbornness", "Domineering", "Isolation"],
    careerPaths: ["Entrepreneur", "CEO", "Inventor", "Pioneer", "Manager"],
    compatibility: [1, 5, 7]
  },
  2: {
    number: 2,
    title: "The Peacemaker",
    description: "Cooperative, diplomatic, and sensitive. Natural mediators who bring harmony.",
    strengths: ["Cooperation", "Diplomacy", "Sensitivity", "Patience", "Teamwork"],
    challenges: ["Indecision", "Over-sensitivity", "Dependency", "Passivity", "Self-doubt"],
    careerPaths: ["Counselor", "Diplomat", "Teacher", "Social Worker", "Mediator"],
    compatibility: [2, 4, 8]
  },
  3: {
    number: 3,
    title: "The Creative",
    description: "Artistic, expressive, and optimistic. Natural entertainers and communicators.",
    strengths: ["Creativity", "Communication", "Optimism", "Inspiration", "Artistic talent"],
    challenges: ["Scattered energy", "Superficiality", "Mood swings", "Criticism sensitivity", "Procrastination"],
    careerPaths: ["Artist", "Writer", "Performer", "Designer", "Communicator"],
    compatibility: [3, 6, 9]
  },
  4: {
    number: 4,
    title: "The Builder",
    description: "Practical, organized, and hardworking. Natural builders of solid foundations.",
    strengths: ["Organization", "Reliability", "Hard work", "Practicality", "Loyalty"],
    challenges: ["Rigidity", "Stubbornness", "Narrow-mindedness", "Workaholism", "Resistance to change"],
    careerPaths: ["Engineer", "Architect", "Accountant", "Manager", "Craftsperson"],
    compatibility: [2, 4, 8]
  },
  5: {
    number: 5,
    title: "The Explorer",
    description: "Adventurous, freedom-loving, and versatile. Natural explorers seeking variety.",
    strengths: ["Adaptability", "Freedom", "Adventure", "Versatility", "Progressive thinking"],
    challenges: ["Restlessness", "Irresponsibility", "Inconsistency", "Impatience", "Addiction prone"],
    careerPaths: ["Travel guide", "Sales", "Journalist", "Entrepreneur", "Consultant"],
    compatibility: [1, 5, 7]
  },
  6: {
    number: 6,
    title: "The Nurturer",
    description: "Caring, responsible, and family-oriented. Natural healers and caregivers.",
    strengths: ["Nurturing", "Responsibility", "Compassion", "Healing", "Service"],
    challenges: ["Over-responsibility", "Martyrdom", "Worry", "Perfectionism", "Meddling"],
    careerPaths: ["Healthcare", "Teaching", "Counseling", "Social work", "Hospitality"],
    compatibility: [3, 6, 9]
  },
  7: {
    number: 7,
    title: "The Seeker",
    description: "Analytical, spiritual, and introspective. Natural researchers and truth seekers.",
    strengths: ["Analysis", "Intuition", "Spirituality", "Research", "Wisdom"],
    challenges: ["Isolation", "Skepticism", "Aloofness", "Perfectionism", "Pessimism"],
    careerPaths: ["Researcher", "Analyst", "Scientist", "Philosopher", "Spiritual teacher"],
    compatibility: [1, 5, 7]
  },
  8: {
    number: 8,
    title: "The Achiever",
    description: "Ambitious, material success-oriented, and powerful. Natural business leaders.",
    strengths: ["Ambition", "Business acumen", "Leadership", "Material success", "Organization"],
    challenges: ["Materialism", "Workaholism", "Impatience", "Stress", "Ruthlessness"],
    careerPaths: ["Business executive", "Banker", "Real estate", "Politics", "Finance"],
    compatibility: [2, 4, 8]
  },
  9: {
    number: 9,
    title: "The Humanitarian",
    description: "Compassionate, generous, and idealistic. Natural humanitarians serving others.",
    strengths: ["Compassion", "Generosity", "Idealism", "Universal love", "Wisdom"],
    challenges: ["Emotional volatility", "Impracticality", "Martyrdom", "Moodiness", "Resentment"],
    careerPaths: ["Humanitarian", "Artist", "Teacher", "Healer", "Philanthropist"],
    compatibility: [3, 6, 9]
  },
  11: {
    number: 11,
    title: "The Intuitive",
    description: "Highly intuitive, inspirational, and spiritual. Master number with great potential.",
    strengths: ["Intuition", "Inspiration", "Spirituality", "Idealism", "Sensitivity"],
    challenges: ["Nervous tension", "Impracticality", "Extremes", "Self-doubt", "Oversensitivity"],
    careerPaths: ["Spiritual teacher", "Artist", "Healer", "Counselor", "Inventor"],
    compatibility: [2, 11, 22]
  },
  22: {
    number: 22,
    title: "The Master Builder",
    description: "Visionary, practical idealist, and powerful. Master number capable of great achievements.",
    strengths: ["Vision", "Practical idealism", "Leadership", "Organization", "Achievement"],
    challenges: ["Pressure", "Nervous tension", "Extremes", "Self-doubt", "Overwhelming responsibility"],
    careerPaths: ["Visionary leader", "Architect", "International business", "Diplomat", "Reformer"],
    compatibility: [4, 11, 22]
  },
  33: {
    number: 33,
    title: "The Master Teacher",
    description: "Highly evolved, compassionate leader, and master teacher. Rare master number.",
    strengths: ["Compassion", "Healing", "Teaching", "Spiritual guidance", "Universal love"],
    challenges: ["Overwhelming responsibility", "Sacrifice", "Emotional burden", "High expectations", "Burnout"],
    careerPaths: ["Spiritual leader", "Healer", "Teacher", "Humanitarian", "Counselor"],
    compatibility: [6, 11, 33]
  }
};

/**
 * Gets interpretation for a specific number
 */
export function getNumberInterpretation(number: number): NumberInterpretation {
  return NUMBER_INTERPRETATIONS[number] || NUMBER_INTERPRETATIONS[1];
}

/**
 * Calculates compatibility between two life path numbers
 */
export function calculateCompatibility(number1: number, number2: number): {
  score: number;
  description: string;
} {
  const interpretation1 = getNumberInterpretation(number1);
  const interpretation2 = getNumberInterpretation(number2);
  
  const isCompatible = interpretation1.compatibility.includes(number2) || 
                      interpretation2.compatibility.includes(number1);
  
  let score = 50; // Base compatibility
  
  if (isCompatible) score += 30;
  if (number1 === number2) score += 20;
  
  // Special compatibility rules
  if ((number1 === 1 && number2 === 8) || (number1 === 8 && number2 === 1)) score += 20;
  if ((number1 === 2 && number2 === 6) || (number1 === 6 && number2 === 2)) score += 25;
  if ((number1 === 3 && number2 === 5) || (number1 === 5 && number2 === 3)) score += 15;
  
  score = Math.min(100, Math.max(0, score));
  
  let description = "";
  if (score >= 80) description = "Excellent compatibility - A harmonious and supportive relationship";
  else if (score >= 60) description = "Good compatibility - Strong potential for a lasting relationship";
  else if (score >= 40) description = "Moderate compatibility - Requires understanding and compromise";
  else description = "Challenging compatibility - Significant differences to work through";
  
  return { score, description };
}