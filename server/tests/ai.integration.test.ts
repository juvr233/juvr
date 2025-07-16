import { AiModelType } from '../src/models/aiModel.model';
import aiInferenceService from '../src/services/ai/aiInference.service';
import modelTrainingService from '../src/services/ai/modelTraining.service';
import trainingDataService from '../src/services/ai/trainingData.service';
import { ABTestingService } from '../src/services/ai/abTesting.service';
import * as fs from 'fs';
const path = require('path');

// Mock logger to avoid polluting test output
jest.mock('../src/config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('../src/models/aiModel.model', () => {
    const mockModelStore = {
        _id: 'mock-model-id',
        type: 'numerology',
        name: 'Numerology Model',
        version: '1.0.0',
        status: 'inactive',
        trainingData: [],
        trainingDataSize: 0,
        accuracy: 0,
        parameters: {},
        save: jest.fn().mockImplementation(function() {
            return Promise.resolve(this);
        }),
    };

    const AiModel = {
        findOne: jest.fn().mockImplementation(({ type }) => {
            mockModelStore.type = type;
            return Promise.resolve(mockModelStore);
        }),
        save: jest.fn(),
    };

    return {
        __esModule: true,
        default: AiModel,
        AiModelType: {
            NUMEROLOGY: 'numerology',
            TAROT: 'tarot',
            ICHING: 'iching',
            COMPATIBILITY: 'compatibility',
            BAZI: 'bazi',
            STAR_ASTROLOGY: 'star_astrology',
            HOLISTIC: 'holistic',
        },
    };
});

jest.mock('@tensorflow/tfjs-node', () => ({
    ...jest.requireActual('@tensorflow/tfjs-node'),
    loadLayersModel: jest.fn(() => Promise.resolve({
        predict: jest.fn(() => ({
            data: jest.fn(() => Promise.resolve([0.1, 0.2, 0.7])),
        })),
    })),
}));

describe('AI Services Integration Tests', () => {
  const testDataDir = path.join(__dirname, 'test-data');
  const numerologyTestDataPath = path.join(testDataDir, 'numerology-data.json');

  beforeAll(() => {
    // Create test data directory if it doesn't exist
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir);
    }

    // Create a sample numerology test data file with 10 items
    const numerologyTestData = Array.from({ length: 10 }, (_, i) => ({
        input: { birthDate: `1990-01-${10 + i}`, name: `Test User ${i}` },
        output: { interpretation: `Test interpretation ${i}` },
        quality: 0.9,
    }));
    fs.writeFileSync(numerologyTestDataPath, JSON.stringify(numerologyTestData, null, 2));
  });

  afterAll(() => {
    // Clean up test data
    fs.unlinkSync(numerologyTestDataPath);
    fs.rmdirSync(testDataDir);
  });

  describe('Full AI Pipeline Test: Numerology', () => {
    it('should import data, train a model, and perform inference', async () => {
      // 1. Import Data
      const importedCount = await trainingDataService.importFromExternalSource(
        AiModelType.NUMEROLOGY,
        numerologyTestDataPath,
        'json'
      );
      expect(importedCount).toBe(10);

      // 2. Train Model
      const trainedModel = await modelTrainingService.trainModel(AiModelType.NUMEROLOGY, { epochs: 1 });
      expect(trainedModel).not.toBeNull();
      expect(trainedModel?.status).toBe('active');
      expect(trainedModel?.accuracy).toBeGreaterThan(0);

      // 3. Perform Inference
      const inferenceResult = await aiInferenceService.generateReading(AiModelType.NUMEROLOGY, {
        birthDate: '1992-08-20',
        name: 'Inference Test',
      });
      expect(inferenceResult).toBeDefined();
      expect(inferenceResult.prediction).toBeDefined();
    }, 30000);
  });

  describe('A/B Testing Service Integration', () => {
    const abTestingService = new ABTestingService();
    const testName = 'numerology_reading_format';
    const userId = 'user-12345';

    it('should correctly assign a user to a test variant', () => {
      abTestingService.setTestConfiguration(testName, [
        { id: 'short_format', weight: 0.5, description: 'Short, concise reading' },
        { id: 'detailed_format', weight: 0.5, description: 'Detailed, narrative reading' },
      ]);

      const variant = abTestingService.assignTestVariant(userId, testName);
      expect(['short_format', 'detailed_format']).toContain(variant);
    });

    it('should record and retrieve test results', () => {
      // Record some results
      abTestingService.recordResult({
        userId: 'user-1',
        testName,
        variantId: 'short_format',
        success: true,
        metrics: { readingTime: 30 },
      });
      abTestingService.recordResult({
        userId: 'user-2',
        testName,
        variantId: 'detailed_format',
        success: false,
        metrics: { readingTime: 90 },
      });
      abTestingService.recordResult({
        userId: 'user-3',
        testName,
        variantId: 'short_format',
        success: true,
        metrics: { readingTime: 35 },
      });

      const results = abTestingService.getTestResults(testName);
      expect(results.success).toBe(true);
      expect(results.totalResults).toBe(3);
      
      const shortFormatStats = results.resultsByVariant.short_format;
      expect(shortFormatStats.totalCount).toBe(2);
      expect(shortFormatStats.successCount).toBe(2);
      expect(shortFormatStats.successRate).toBe(100);
      expect(shortFormatStats.metrics.readingTime.average).toBe(32.5);

      const detailedFormatStats = results.resultsByVariant.detailed_format;
      expect(detailedFormatStats.totalCount).toBe(1);
      expect(detailedFormatStats.successCount).toBe(0);
      expect(detailedFormatStats.successRate).toBe(0);
    });
  });
});
