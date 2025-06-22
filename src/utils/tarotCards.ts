// Authentic Rider-Waite-Smith Tarot Card Database
// Using high-quality, consistent RWS deck images from reliable sources

export interface TarotCard {
  id: number;
  name: string;
  meaning: string;
  reversedMeaning: string;
  suit: string;
  image: string;
  isReversed: boolean;
}

// Rider-Waite-Smith deck with authentic card images
// Using Wikimedia Commons and other public domain sources for consistency
export const AUTHENTIC_RWS_DECK: Omit<TarotCard, 'isReversed'>[] = [
  // Major Arcana (22 cards) - Classic Rider-Waite-Smith
  { 
    id: 0, 
    name: "The Fool", 
    meaning: "New beginnings, innocence, spontaneity, free spirit", 
    reversedMeaning: "Recklessness, taken advantage of, inconsideration, foolishness", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg"
  },
  { 
    id: 1, 
    name: "The Magician", 
    meaning: "Manifestation, resourcefulness, power, inspired action", 
    reversedMeaning: "Manipulation, poor planning, untapped talents, illusions", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg"
  },
  { 
    id: 2, 
    name: "The High Priestess", 
    meaning: "Intuition, sacred knowledge, divine feminine, subconscious mind", 
    reversedMeaning: "Secrets, disconnected from intuition, withdrawal, silence", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg"
  },
  { 
    id: 3, 
    name: "The Empress", 
    meaning: "Femininity, beauty, nature, abundance, motherhood", 
    reversedMeaning: "Creative block, dependence on others, emptiness, maternal issues", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg"
  },
  { 
    id: 4, 
    name: "The Emperor", 
    meaning: "Authority, establishment, structure, father figure, leadership", 
    reversedMeaning: "Tyranny, rigidity, coldness, loss of authority", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg"
  },
  { 
    id: 5, 
    name: "The Hierophant", 
    meaning: "Spiritual wisdom, religious beliefs, conformity, tradition", 
    reversedMeaning: "Personal beliefs, freedom, challenging the status quo, unconventional", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg"
  },
  { 
    id: 6, 
    name: "The Lovers", 
    meaning: "Love, harmony, relationships, values alignment, choices", 
    reversedMeaning: "Self-love, disharmony, imbalance, misalignment of values", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg"
  },
  { 
    id: 7, 
    name: "The Chariot", 
    meaning: "Control, willpower, success, determination, direction", 
    reversedMeaning: "Self-discipline, opposition, lack of direction, scattered energy", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg"
  },
  { 
    id: 8, 
    name: "Strength", 
    meaning: "Strength, courage, persuasion, influence, compassion", 
    reversedMeaning: "Self doubt, low energy, raw emotion, lack of confidence", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg"
  },
  { 
    id: 9, 
    name: "The Hermit", 
    meaning: "Soul searching, introspection, inner guidance, solitude", 
    reversedMeaning: "Isolation, loneliness, withdrawal, lost your way", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg"
  },
  { 
    id: 10, 
    name: "Wheel of Fortune", 
    meaning: "Good luck, karma, life cycles, destiny, turning point", 
    reversedMeaning: "Bad luck, lack of control, clinging to control, unwelcome changes", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg"
  },
  { 
    id: 11, 
    name: "Justice", 
    meaning: "Justice, fairness, truth, cause and effect, law", 
    reversedMeaning: "Unfairness, lack of accountability, dishonesty, legal issues", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg"
  },
  { 
    id: 12, 
    name: "The Hanged Man", 
    meaning: "Suspension, restriction, letting go, sacrifice, martyrdom", 
    reversedMeaning: "Martyrdom, indecision, delay, resistance", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg"
  },
  { 
    id: 13, 
    name: "Death", 
    meaning: "Endings, beginnings, change, transformation, transition", 
    reversedMeaning: "Resistance to change, personal transformation, inner purging", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg"
  },
  { 
    id: 14, 
    name: "Temperance", 
    meaning: "Balance, moderation, patience, purpose, divine timing", 
    reversedMeaning: "Imbalance, excess, self-healing, re-alignment", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg"
  },
  { 
    id: 15, 
    name: "The Devil", 
    meaning: "Shadow self, attachment, addiction, restriction, sexuality", 
    reversedMeaning: "Releasing limiting beliefs, exploring dark thoughts, detachment", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg"
  },
  { 
    id: 16, 
    name: "The Tower", 
    meaning: "Sudden change, upheaval, chaos, revelation, awakening", 
    reversedMeaning: "Personal transformation, fear of change, averting disaster", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg"
  },
  { 
    id: 17, 
    name: "The Star", 
    meaning: "Hope, faith, purpose, renewal, spirituality, healing", 
    reversedMeaning: "Lack of faith, despair, self-trust, disconnection", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg"
  },
  { 
    id: 18, 
    name: "The Moon", 
    meaning: "Illusion, fear, anxiety, subconscious, intuition, dreams", 
    reversedMeaning: "Release of fear, repressed emotion, inner confusion", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg"
  },
  { 
    id: 19, 
    name: "The Sun", 
    meaning: "Positivity, fun, warmth, success, vitality, enlightenment", 
    reversedMeaning: "Inner child, feeling down, overly optimistic, delayed success", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg"
  },
  { 
    id: 20, 
    name: "Judgement", 
    meaning: "Judgement, rebirth, inner calling, absolution, awakening", 
    reversedMeaning: "Self-doubt, inner critic, ignoring the call, lack of self-awareness", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg"
  },
  { 
    id: 21, 
    name: "The World", 
    meaning: "Completion, integration, accomplishment, travel, fulfillment", 
    reversedMeaning: "Seeking personal closure, short-cut to success, delays", 
    suit: "Major Arcana", 
    image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg"
  },
  
  // Minor Arcana - Cups (14 cards)
  { 
    id: 22, 
    name: "Ace of Cups", 
    meaning: "Love, new relationships, compassion, creativity", 
    reversedMeaning: "Self-love, intuition, repressed emotions", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Cups01.jpg"
  },
  { 
    id: 23, 
    name: "Two of Cups", 
    meaning: "Unified love, partnership, mutual attraction", 
    reversedMeaning: "Self-love, break-ups, disharmony", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Cups02.jpg"
  },
  { 
    id: 24, 
    name: "Three of Cups", 
    meaning: "Celebration, friendship, creativity, community", 
    reversedMeaning: "Independence, alone time, hardcore partying", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Cups03.jpg"
  },
  { 
    id: 25, 
    name: "Four of Cups", 
    meaning: "Meditation, contemplation, apathy, reevaluation", 
    reversedMeaning: "Retreat, withdrawal, checking in with yourself", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/3/35/Cups04.jpg"
  },
  { 
    id: 26, 
    name: "Five of Cups", 
    meaning: "Regret, failure, disappointment, pessimism", 
    reversedMeaning: "Personal setbacks, self-forgiveness, moving on", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Cups05.jpg"
  },
  { 
    id: 27, 
    name: "Six of Cups", 
    meaning: "Revisiting the past, childhood memories, innocence", 
    reversedMeaning: "Living in the past, forgiveness, lacking playfulness", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/1/17/Cups06.jpg"
  },
  { 
    id: 28, 
    name: "Seven of Cups", 
    meaning: "Opportunities, choices, wishful thinking, illusion", 
    reversedMeaning: "Alignment, personal values, overwhelmed by choices", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Cups07.jpg"
  },
  { 
    id: 29, 
    name: "Eight of Cups", 
    meaning: "Disappointment, abandonment, withdrawal, escapism", 
    reversedMeaning: "Trying one more time, indecision, aimless drifting", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/6/60/Cups08.jpg"
  },
  { 
    id: 30, 
    name: "Nine of Cups", 
    meaning: "Contentment, satisfaction, gratitude, wish come true", 
    reversedMeaning: "Inner happiness, materialism, dissatisfaction", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Cups09.jpg"
  },
  { 
    id: 31, 
    name: "Ten of Cups", 
    meaning: "Divine love, blissful relationships, harmony, alignment", 
    reversedMeaning: "Disconnection, misaligned values, struggling relationships", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/8/84/Cups10.jpg"
  },
  { 
    id: 32, 
    name: "Page of Cups", 
    meaning: "Creative opportunities, intuitive messages, curiosity", 
    reversedMeaning: "New ideas, doubting intuition, creative blocks", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Cups11.jpg"
  },
  { 
    id: 33, 
    name: "Knight of Cups", 
    meaning: "Creativity, romance, bringing or receiving a message", 
    reversedMeaning: "Moodiness, disappointment, unrealistic expectations", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Cups12.jpg"
  },
  { 
    id: 34, 
    name: "Queen of Cups", 
    meaning: "Compassionate, caring, emotionally stable, intuitive", 
    reversedMeaning: "Inner feelings, self-care, self-love", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/6/62/Cups13.jpg"
  },
  { 
    id: 35, 
    name: "King of Cups", 
    meaning: "Emotionally balanced, compassionate, diplomatic", 
    reversedMeaning: "Self-compassion, inner feelings, moodiness", 
    suit: "Cups", 
    image: "https://upload.wikimedia.org/wikipedia/commons/0/04/Cups14.jpg"
  },
  
  // Minor Arcana - Wands (14 cards)
  { 
    id: 36, 
    name: "Ace of Wands", 
    meaning: "Inspiration, new opportunities, growth, potential", 
    reversedMeaning: "An emerging idea, lack of direction, distractions", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/1/11/Wands01.jpg"
  },
  { 
    id: 37, 
    name: "Two of Wands", 
    meaning: "Future planning, making decisions, leaving comfort zone", 
    reversedMeaning: "Personal goals, inner alignment, fear of unknown", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Wands02.jpg"
  },
  { 
    id: 38, 
    name: "Three of Wands", 
    meaning: "Expansion, foresight, overseas opportunities", 
    reversedMeaning: "Playing small, lack of foresight, unexpected delays", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Wands03.jpg"
  },
  { 
    id: 39, 
    name: "Four of Wands", 
    meaning: "Celebration, joy, harmony, relaxation, homecoming", 
    reversedMeaning: "Personal celebration, inner harmony, conflict with others", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Wands04.jpg"
  },
  { 
    id: 40, 
    name: "Five of Wands", 
    meaning: "Conflict, disagreements, competition, tension", 
    reversedMeaning: "Inner conflict, conflict avoidance, releasing tension", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Wands05.jpg"
  },
  { 
    id: 41, 
    name: "Six of Wands", 
    meaning: "Success, public recognition, progress, self-confidence", 
    reversedMeaning: "Private achievement, personal definition of success", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Wands06.jpg"
  },
  { 
    id: 42, 
    name: "Seven of Wands", 
    meaning: "Challenge, competition, protection, perseverance", 
    reversedMeaning: "Exhaustion, giving up, overwhelmed", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Wands07.jpg"
  },
  { 
    id: 43, 
    name: "Eight of Wands", 
    meaning: "Swiftness, speed, progress, quick decisions", 
    reversedMeaning: "Delays, frustration, resisting change", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wands08.jpg"
  },
  { 
    id: 44, 
    name: "Nine of Wands", 
    meaning: "Resilience, courage, persistence, test of faith", 
    reversedMeaning: "Inner resources, struggle, overwhelm", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Wands09.jpg"
  },
  { 
    id: 45, 
    name: "Ten of Wands", 
    meaning: "Burden, extra responsibility, hard work, completion", 
    reversedMeaning: "Doing it all, carrying the burden, delegation", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Wands10.jpg"
  },
  { 
    id: 46, 
    name: "Page of Wands", 
    meaning: "Inspiration, ideas, discovery, limitless potential", 
    reversedMeaning: "Newly-formed ideas, redirecting energy, self-limiting beliefs", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Wands11.jpg"
  },
  { 
    id: 47, 
    name: "Knight of Wands", 
    meaning: "Energy, passion, inspired action, adventure", 
    reversedMeaning: "Passion project, haste, scattered energy", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/1/16/Wands12.jpg"
  },
  { 
    id: 48, 
    name: "Queen of Wands", 
    meaning: "Energy, attraction, confidence, determination", 
    reversedMeaning: "Self-respect, self-confidence, introverted", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Wands13.jpg"
  },
  { 
    id: 49, 
    name: "King of Wands", 
    meaning: "Natural leader, vision, entrepreneur, honour", 
    reversedMeaning: "Impulsiveness, haste, ruthless", 
    suit: "Wands", 
    image: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Wands14.jpg"
  },
  
  // Minor Arcana - Swords (14 cards)
  { 
    id: 50, 
    name: "Ace of Swords", 
    meaning: "Breakthrough, clarity, sharp mind, new ideas", 
    reversedMeaning: "Inner clarity, re-thinking an idea, clouded judgement", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Swords01.jpg"
  },
  { 
    id: 51, 
    name: "Two of Swords", 
    meaning: "Difficult decisions, weighing options, indecision", 
    reversedMeaning: "Inner turmoil, confusion, information overload", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Swords02.jpg"
  },
  { 
    id: 52, 
    name: "Three of Swords", 
    meaning: "Heartbreak, emotional pain, sorrow, grief", 
    reversedMeaning: "Negative self-talk, releasing pain, optimism", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/0/02/Swords03.jpg"
  },
  { 
    id: 53, 
    name: "Four of Swords", 
    meaning: "Rest, relaxation, meditation, contemplation", 
    reversedMeaning: "Exhaustion, burn-out, deep contemplation", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Swords04.jpg"
  },
  { 
    id: 54, 
    name: "Five of Swords", 
    meaning: "Conflict, disagreements, competition, defeat", 
    reversedMeaning: "Reconciliation, making amends, past resentment", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/2/23/Swords05.jpg"
  },
  { 
    id: 55, 
    name: "Six of Swords", 
    meaning: "Transition, change, rite of passage, releasing baggage", 
    reversedMeaning: "Personal transition, resistance to change", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/2/29/Swords06.jpg"
  },
  { 
    id: 56, 
    name: "Seven of Swords", 
    meaning: "Betrayal, deception, getting away with something", 
    reversedMeaning: "Imposter syndrome, self-deceit, keeping secrets", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Swords07.jpg"
  },
  { 
    id: 57, 
    name: "Eight of Swords", 
    meaning: "Negative thoughts, self-imposed restriction, victim mentality", 
    reversedMeaning: "Self-limiting beliefs, inner critic, releasing victim mentality", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Swords08.jpg"
  },
  { 
    id: 58, 
    name: "Nine of Swords", 
    meaning: "Anxiety, worry, fear, depression, nightmares", 
    reversedMeaning: "Inner turmoil, deep-seated fears, shame", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Swords09.jpg"
  },
  { 
    id: 59, 
    name: "Ten of Swords", 
    meaning: "Painful endings, deep wounds, betrayal, loss", 
    reversedMeaning: "Recovery, regeneration, resisting an inevitable end", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords10.jpg"
  },
  { 
    id: 60, 
    name: "Page of Swords", 
    meaning: "New ideas, curiosity, thirst for knowledge, new ways of communicating", 
    reversedMeaning: "Self-expression, all talk and no action, haphazard action", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Swords11.jpg"
  },
  { 
    id: 61, 
    name: "Knight of Swords", 
    meaning: "Ambitious, action-oriented, driven to succeed", 
    reversedMeaning: "Restless, unfocused, impulsive", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Swords12.jpg"
  },
  { 
    id: 62, 
    name: "Queen of Swords", 
    meaning: "Independent, unbiased judgement, clear boundaries", 
    reversedMeaning: "Self-defence, self-criticism, cold-hearted", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords13.jpg"
  },
  { 
    id: 63, 
    name: "King of Swords", 
    meaning: "Mental clarity, intellectual power, authority, truth", 
    reversedMeaning: "Quiet power, inner truth, misuse of power", 
    suit: "Swords", 
    image: "https://upload.wikimedia.org/wikipedia/commons/3/33/Swords14.jpg"
  },
  
  // Minor Arcana - Pentacles (14 cards)
  { 
    id: 64, 
    name: "Ace of Pentacles", 
    meaning: "A new financial or career opportunity, manifestation", 
    reversedMeaning: "Lost opportunity, lack of planning, bad investment", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Pents01.jpg"
  },
  { 
    id: 65, 
    name: "Two of Pentacles", 
    meaning: "Multiple priorities, time management, prioritization", 
    reversedMeaning: "Over-committed, disorganization, reprioritization", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Pents02.jpg"
  },
  { 
    id: 66, 
    name: "Three of Pentacles", 
    meaning: "Teamwork, collaboration, learning, implementation", 
    reversedMeaning: "Disharmony, misalignment, working alone", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Pents03.jpg"
  },
  { 
    id: 67, 
    name: "Four of Pentacles", 
    meaning: "Saving money, security, conservatism, scarcity", 
    reversedMeaning: "Over-spending, greed, self-protection", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/3/35/Pents04.jpg"
  },
  { 
    id: 68, 
    name: "Five of Pentacles", 
    meaning: "Financial loss, poverty, lack mindset, isolation", 
    reversedMeaning: "Recovery from financial loss, spiritual poverty", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Pents05.jpg"
  },
  { 
    id: 69, 
    name: "Six of Pentacles", 
    meaning: "Giving, receiving, sharing wealth, generosity", 
    reversedMeaning: "Self-care, unpaid debts, one-sided charity", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Pents06.jpg"
  },
  { 
    id: 70, 
    name: "Seven of Pentacles", 
    meaning: "Long-term view, sustainable results, perseverance", 
    reversedMeaning: "Lack of long-term vision, limited success", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Pents07.jpg"
  },
  { 
    id: 71, 
    name: "Eight of Pentacles", 
    meaning: "Apprenticeship, repetitive tasks, mastery, skill development", 
    reversedMeaning: "Self-development, perfectionism, misdirected activity", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/4/49/Pents08.jpg"
  },
  { 
    id: 72, 
    name: "Nine of Pentacles", 
    meaning: "Abundance, luxury, self-sufficiency, financial independence", 
    reversedMeaning: "Self-worth, over-investment in work, hustling", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Pents09.jpg"
  },
  { 
    id: 73, 
    name: "Ten of Pentacles", 
    meaning: "Wealth, financial security, family, long-term success", 
    reversedMeaning: "The dark side of wealth, financial failure", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/4/42/Pents10.jpg"
  },
  { 
    id: 74, 
    name: "Page of Pentacles", 
    meaning: "Manifestation, financial opportunity, skill development", 
    reversedMeaning: "Lack of progress, procrastination, learn from failure", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Pents11.jpg"
  },
  { 
    id: 75, 
    name: "Knight of Pentacles", 
    meaning: "Hard work, productivity, routine, conservatism", 
    reversedMeaning: "Self-discipline, boredom, feeling 'stuck', perfectionism", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Pents12.jpg"
  },
  { 
    id: 76, 
    name: "Queen of Pentacles", 
    meaning: "Nurturing, practical, providing financially, a working parent", 
    reversedMeaning: "Financial independence, self-care, work-home conflict", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/8/88/Pents13.jpg"
  },
  { 
    id: 77, 
    name: "King of Pentacles", 
    meaning: "Financial abundance, business, leadership, security", 
    reversedMeaning: "Financial insecurity, obsessed with wealth and status", 
    suit: "Pentacles", 
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Pents14.jpg"
  }
];

// Fisher-Yates shuffle algorithm for true randomization
export function shuffleDeck(): TarotCard[] {
  const deck = [...AUTHENTIC_RWS_DECK];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  // Add reversed status (30% chance for each card)
  return deck.map(card => ({
    ...card,
    isReversed: Math.random() < 0.3
  }));
}

// Get detailed interpretation based on card, position, and life area
export function getDetailedInterpretation(
  card: TarotCard, 
  position: string, 
  lifeArea: string
): string {
  const baseMeaning = card.isReversed ? card.reversedMeaning : card.meaning;
  
  // Enhanced interpretations based on context
  const contextualInterpretations: { [key: string]: { [key: string]: string } } = {
    love: {
      'Past': `In matters of the heart, this card reveals how past relationships and emotional experiences have shaped your current romantic landscape. ${baseMeaning}`,
      'Present': `Your current love situation is illuminated by this card. ${baseMeaning} This energy is actively influencing your romantic connections right now.`,
      'Future': `The path of love ahead shows ${baseMeaning.toLowerCase()}. This card suggests the romantic developments that await you.`,
      'Situation': `The overall energy surrounding your love life is represented by ${baseMeaning.toLowerCase()}. This card captures the essence of your romantic situation.`,
      'Challenge': `The main challenge in your love life is reflected in ${baseMeaning.toLowerCase()}. This obstacle requires your attention and wisdom to overcome.`,
      'Outcome': `If you continue on your current romantic path, the likely outcome involves ${baseMeaning.toLowerCase()}. This card shows your love destiny.`
    },
    career: {
      'Past': `Your professional history and past career decisions have created the foundation shown by ${baseMeaning.toLowerCase()}. These experiences continue to influence your work life.`,
      'Present': `Your current career situation embodies ${baseMeaning.toLowerCase()}. This energy is actively shaping your professional experiences right now.`,
      'Future': `Your career path ahead reveals ${baseMeaning.toLowerCase()}. This card indicates the professional developments and opportunities coming your way.`,
      'Situation': `The overall state of your career is characterized by ${baseMeaning.toLowerCase()}. This card captures the essence of your professional life.`,
      'Challenge': `The primary obstacle in your career involves ${baseMeaning.toLowerCase()}. This challenge requires strategic thinking and determination to overcome.`,
      'Outcome': `Continuing on your current professional trajectory leads to ${baseMeaning.toLowerCase()}. This card reveals your career destiny.`
    },
    wealth: {
      'Past': `Your financial history and past money decisions have created the foundation of ${baseMeaning.toLowerCase()}. These experiences continue to influence your relationship with abundance.`,
      'Present': `Your current financial situation reflects ${baseMeaning.toLowerCase()}. This energy is actively affecting your material resources and money flow.`,
      'Future': `Your financial future shows ${baseMeaning.toLowerCase()}. This card indicates the monetary developments and opportunities approaching you.`,
      'Situation': `The overall state of your finances embodies ${baseMeaning.toLowerCase()}. This card captures the essence of your relationship with money and material security.`,
      'Challenge': `The main financial challenge you face involves ${baseMeaning.toLowerCase()}. This obstacle requires wisdom and practical action to overcome.`,
      'Outcome': `Following your current financial path leads to ${baseMeaning.toLowerCase()}. This card reveals your monetary destiny.`
    }
  };
  
  return contextualInterpretations[lifeArea]?.[position] || 
         `In this position, the card represents ${baseMeaning.toLowerCase()}, offering guidance for your ${lifeArea} journey.`;
}