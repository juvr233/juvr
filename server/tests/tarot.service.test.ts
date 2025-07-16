import tarotInferenceService from '../src/services/ai/tarotInference.service';
import tarotModelTrainingService from '../src/services/ai/tarotModelTraining.service';
import tarotTrainingDataService from '../src/services/ai/tarotTrainingData.service';
import AiModel from '../src/models/aiModel.model';
import UserHistory from '../src/models/userHistory.model';
import * as fs from 'fs';
import aiService from '../src/services/ai.service';

jest.mock('../src/config/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), debug: jest.fn(), warn: jest.fn() },
}));

const mockSave = jest.fn().mockReturnThis();
const mockModelInstance = {
  _id: 'mock-tarot-model-id',
  type: 'tarot',
  name: 'Tarot Model',
  version: '1.0.0',
  status: 'active',
  trainingData: [],
  trainingDataSize: 0,
  accuracy: 0.9,
  parameters: {},
  save: mockSave,
};

jest.mock('../src/models/aiModel.model', () => {
    const modelStatic = {
        findOne: jest.fn().mockResolvedValue(mockModelInstance),
        find: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
        save: mockSave,
    };

    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => mockModelInstance),
        ...modelStatic,
    };
});

jest.mock('../src/models/userHistory.model', () => ({
    find: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
    }),
}));

jest.mock('../src/services/ai.service', () => ({
    __esModule: true,
    default: {
        generateText: jest.fn().mockResolvedValue('AI text response'),
    },
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    ...jest.requireActual('fs').promises,
    readFile: jest.fn().mockResolvedValue(JSON.stringify({
      major: { 'The Fool': { upright: 'New beginnings', reversed: 'Recklessness' } },
      spreads: { 'three-card': { positions: ['past', 'present', 'future'] } },
    })),
    writeFile: jest.fn().mockResolvedValue(undefined),
    mkdir: jest.fn().mockResolvedValue(undefined),
  },
  existsSync: jest.fn(() => true),
  readFileSync: jest.fn(() => JSON.stringify([{question: 'Q', spread: 'S', cards: [], interpretations: {}, overallReading: 'O', advice: 'A'}])),
  writeFileSync: jest.fn(),
}));


describe('Tarot AI Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AiModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'mock-tarot-model-id',
        type: 'tarot',
        name: 'Tarot Model',
        version: '1.0.0',
        status: 'active',
        trainingData: [],
        trainingDataSize: 0,
        accuracy: 0.9,
        parameters: {},
        save: jest.fn().mockReturnThis(),
    });
  });

  describe('TarotInferenceService', () => {
    it('should generate a reading using the AI model', async () => {
      const input = {
        question: 'What is my career path?',
        spread: 'three-card',
        cards: [{ name: 'The Fool', position: 'present', reversed: false }],
      };
      const result = await tarotInferenceService.generateReading(input);
      expect(result).toBeDefined();
      expect(aiService.generateText).toHaveBeenCalled();
      expect(result.overallReading).toBeDefined();
    });

    it('should fall back to rule engine when AI model is not found', async () => {
      (AiModel.findOne as jest.Mock).mockResolvedValue(null);
      const input = {
        question: 'What is my career path?',
        spread: 'three-card',
        cards: [{ name: 'The Fool', position: 'present', reversed: false }],
      };
      const result = await tarotInferenceService.generateReading(input);
      expect(result).toBeDefined();
      expect(result.overallReading).toContain('This is a rule-based tarot reading.');
    });
  });

  describe('TarotTrainingDataService', () => {
    it('should collect training data from user history', async () => {
      const mockHistory = [{
        type: 'tarot', isFavorite: true,
        data: { question: 'Test', spread: 'three-card', cards: [{ name: 'The Fool' }], interpretations: { present: 'A' } },
      }];
      (UserHistory.find as any)().limit.mockResolvedValue(mockHistory);

      const count = await tarotTrainingDataService.collectFromUserHistory(1);
      expect(count).toBe(1);
      expect(AiModel.findOne).toHaveBeenCalled();
    });

    it('should import data from an expert source', async () => {
      const expertData = `[{"question":"Q","spread":"S","cards":[],"interpretations":{},"overallReading":"O","advice":"A"}]`;
      (fs.promises.readFile as jest.Mock).mockResolvedValue(expertData);

      const count = await tarotTrainingDataService.importFromExpertSource('dummy/path.json');
      expect(count).toBe(1);
      expect(AiModel.findOne).toHaveBeenCalled();
    });

    it('should generate augmented data', async () => {
      (AiModel.findOne as jest.Mock).mockResolvedValue({
          trainingData: [{
            input: { question: 'base q', spread: 's', cards: [{ name: 'The Fool' }, { name: 'The Magician' }] },
            output: { interpretations: {} },
          }],
          save: jest.fn().mockReturnThis(),
      });
      const count = await tarotTrainingDataService.generateAugmentedData(1);
      expect(count).toBeGreaterThan(0);
    });
  });

  describe('TarotModelTrainingService', () => {
    it('should train a model successfully', async () => {
        const modelInstance = {
            trainingData: new Array(10).fill({}),
            status: 'inactive',
            save: jest.fn().mockReturnThis(),
            version: '1.0.0',
        };
      (AiModel.findOne as jest.Mock).mockResolvedValue(modelInstance);
      const trainedModel = await tarotModelTrainingService.trainModel();
      expect(trainedModel).toBeDefined();
      expect(trainedModel.status).toBe('active');
    });

    it('should validate a model', async () => {
        const modelInstance = {
            trainingData: new Array(10).fill({}),
            save: jest.fn().mockReturnThis(),
        };
      (AiModel.findOne as jest.Mock).mockResolvedValue(modelInstance);
      const validation = await tarotModelTrainingService.validateModel();
      expect(validation).toBeDefined();
      expect(validation.accuracy).toBeGreaterThan(0);
    });
  });
});
