import { shuffleDeck, getDetailedInterpretation, AUTHENTIC_RWS_DECK } from '../../utils/tarotCards';

describe('Tarot Cards Utilities', () => {
  describe('AUTHENTIC_RWS_DECK', () => {
    it('should contain 78 cards', () => {
      expect(AUTHENTIC_RWS_DECK).toHaveLength(78);
    });

    it('should have all required properties for each card', () => {
      AUTHENTIC_RWS_DECK.forEach((card, index) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('suit');
        expect(card).toHaveProperty('type');
        expect(card).toHaveProperty('number');
        expect(card).toHaveProperty('image');
        expect(card).toHaveProperty('keywords');
        expect(card).toHaveProperty('meaning');
        expect(card).toHaveProperty('reversedMeaning');
        
        expect(typeof card.id).toBe('string');
        expect(typeof card.name).toBe('string');
        expect(typeof card.image).toBe('string');
        expect(Array.isArray(card.keywords)).toBe(true);
        expect(typeof card.meaning).toBe('string');
        expect(typeof card.reversedMeaning).toBe('string');
        
        // Check that card name is not empty
        expect(card.name.length).toBeGreaterThan(0);
        
        // Check that meanings are not empty
        expect(card.meaning.length).toBeGreaterThan(0);
        expect(card.reversedMeaning.length).toBeGreaterThan(0);
      });
    });

    it('should have unique card IDs', () => {
      const ids = AUTHENTIC_RWS_DECK.map(card => card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have correct distribution of card types', () => {
      const majorArcana = AUTHENTIC_RWS_DECK.filter(card => card.type === 'major');
      const minorArcana = AUTHENTIC_RWS_DECK.filter(card => card.type === 'minor');
      
      expect(majorArcana).toHaveLength(22);
      expect(minorArcana).toHaveLength(56);
    });

    it('should have correct suits for minor arcana', () => {
      const validSuits = ['wands', 'cups', 'swords', 'pentacles'];
      const minorArcana = AUTHENTIC_RWS_DECK.filter(card => card.type === 'minor');
      
      minorArcana.forEach(card => {
        expect(validSuits).toContain(card.suit);
      });
    });
  });

  describe('shuffleDeck', () => {
    it('should return an array of 78 cards', () => {
      const shuffled = shuffleDeck();
      expect(shuffled).toHaveLength(78);
    });

    it('should contain all original cards', () => {
      const shuffled = shuffleDeck();
      const originalIds = AUTHENTIC_RWS_DECK.map(card => card.id).sort();
      const shuffledIds = shuffled.map(card => card.id).sort();
      
      expect(shuffledIds).toEqual(originalIds);
    });

    it('should actually shuffle the deck (not return same order)', () => {
      const shuffled1 = shuffleDeck();
      const shuffled2 = shuffleDeck();
      
      // It's extremely unlikely two shuffles would be identical
      const identical = shuffled1.every((card, index) => 
        card.id === shuffled2[index].id
      );
      
      expect(identical).toBe(false);
    });

    it('should set isReversed property randomly', () => {
      const shuffled = shuffleDeck();
      
      // Check that some cards are reversed (statistically should be true)
      const reversedCards = shuffled.filter(card => card.isReversed);
      expect(reversedCards.length).toBeGreaterThan(0);
      expect(reversedCards.length).toBeLessThan(shuffled.length);
    });
  });

  describe('getDetailedInterpretation', () => {
    const mockCards = [
      {
        ...AUTHENTIC_RWS_DECK[0],
        isReversed: false
      },
      {
        ...AUTHENTIC_RWS_DECK[1],
        isReversed: true
      }
    ];

    it('should return interpretation for valid input', () => {
      const result = getDetailedInterpretation(mockCards, 'three-card', 'love');
      
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('cardInterpretations');
      expect(result).toHaveProperty('advice');
      
      expect(typeof result.summary).toBe('string');
      expect(Array.isArray(result.cardInterpretations)).toBe(true);
      expect(typeof result.advice).toBe('string');
      
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.advice.length).toBeGreaterThan(0);
      expect(result.cardInterpretations).toHaveLength(mockCards.length);
    });

    it('should handle different spread types', () => {
      const spreadTypes = ['three-card', 'five-card', 'celtic-cross'];
      
      spreadTypes.forEach(spreadType => {
        const result = getDetailedInterpretation(
          mockCards.slice(0, 1), 
          spreadType as any, 
          'love'
        );
        
        expect(result).toHaveProperty('summary');
        expect(result.summary).toContain(spreadType);
      });
    });

    it('should handle different life areas', () => {
      const lifeAreas = ['love', 'career', 'wealth', 'spiritual', 'health'];
      
      lifeAreas.forEach(area => {
        const result = getDetailedInterpretation(mockCards, 'three-card', area);
        
        expect(result).toHaveProperty('summary');
        expect(result.summary.toLowerCase()).toContain(area.toLowerCase());
      });
    });

    it('should include reversed meanings for reversed cards', () => {
      const reversedCard = {
        ...AUTHENTIC_RWS_DECK[0],
        isReversed: true
      };

      const result = getDetailedInterpretation([reversedCard], 'three-card', 'love');
      
      expect(result.cardInterpretations[0].interpretation)
        .toContain(reversedCard.reversedMeaning);
    });

    it('should include upright meanings for upright cards', () => {
      const uprightCard = {
        ...AUTHENTIC_RWS_DECK[0],
        isReversed: false
      };

      const result = getDetailedInterpretation([uprightCard], 'three-card', 'love');
      
      expect(result.cardInterpretations[0].interpretation)
        .toContain(uprightCard.meaning);
    });
  });
});