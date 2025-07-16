import { AiModelType } from '../src/models/aiModel.model';
import aiInferenceService from '../src/services/ai/aiInference.service';
import modelTrainingService from '../src/services/ai/modelTraining.service';
import AiModel from '../src/models/aiModel.model';

jest.mock('../src/config/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), debug: jest.fn(), warn: jest.fn() },
}));

const mockAiModelInstance = {
  _id: 'mock-model-id',
  type: 'tarot',
  name: 'Test Model',
  version: '1.0.0',
  status: 'active',
  trainingData: new Array(10).fill({ input: {lifePathNumber: 1}, output: {} }),
  accuracy: 0.85,
  save: jest.fn().mockReturnThis(),
};

jest.mock('../src/models/aiModel.model', () => {
    const modelStatic = {
        findOne: jest.fn().mockResolvedValue(mockAiModelInstance),
    };
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => mockAiModelInstance),
        ...modelStatic,
    };
});

jest.mock('@tensorflow/tfjs-node', () => ({
  loadLayersModel: jest.fn().mockResolvedValue({
    predict: jest.fn().mockReturnValue({
      data: jest.fn().mockResolvedValue([0.1, 0.2, 0.7]),
    }),
  }),
  sequential: () => ({
    add: jest.fn(),
    compile: jest.fn(),
    fit: jest.fn().mockResolvedValue({ history: { acc: [0.9] } }),
  }),
  layers: {
    dense: jest.fn(),
  },
  tensor2d: jest.fn(),
}));

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    promises: {
        ...jest.requireActual('fs').promises,
        readFile: jest.fn().mockResolvedValue('{}'),
    },
    readFileSync: jest.fn(() => '{}'),
}));

describe('AI Services General Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AiModel.findOne as jest.Mock).mockResolvedValue({
        ...mockAiModelInstance,
        trainingData: new Array(10).fill({ input: {lifePathNumber: 1}, output: {} }),
    });
  });

  describe('AiInferenceService', () => {
    it('should generate a numerology reading', async () => {
      const result = await aiInferenceService.generateReading(AiModelType.NUMEROLOGY, {
        birthDate: '1990-01-01',
        name: 'Test',
      });
      expect(result).toBeDefined();
      expect(result.lifePathNumber).toBeDefined();
    });

    it('should handle batch readings', async () => {
      const results = await aiInferenceService.batchGenerateReading(AiModelType.NUMEROLOGY, [
        { birthDate: '1990-01-01' },
        { birthDate: '1991-01-01' },
      ]);
      expect(results).toHaveLength(2);
    });
  });

  describe('ModelTrainingService', () => {
    it('should train a model', async () => {
      const model = await modelTrainingService.trainModel(AiModelType.NUMEROLOGY);
      expect(model).toBeDefined();
      expect(model.status).toBe('active');
      expect(AiModel.findOne).toHaveBeenCalledWith({ type: AiModelType.NUMEROLOGY });
    });

    it('should validate a model', async () => {
      const result = await modelTrainingService.validateModel(AiModelType.NUMEROLOGY);
      expect(result).toBeDefined();
      expect(result.accuracy).toBeGreaterThan(0);
    });

    it('should update a model', async () => {
        (AiModel.findOne as jest.Mock).mockResolvedValue({
            ...mockAiModelInstance,
            status: 'inactive',
            trainingData: [],
            save: jest.fn().mockReturnThis(),
        });
        const model = await modelTrainingService.updateModel(AiModelType.NUMEROLOGY, [{input: {lifePathNumber: 1}, output: {}}]);
        expect(model).toBeDefined();
        expect(model.status).toBe('active');
    });
  });
});
