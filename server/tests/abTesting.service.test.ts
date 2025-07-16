import { ABTestingService } from '../src/services/ai/abTesting.service';

jest.mock('../src/config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('ABTestingService', () => {
  let service: ABTestingService;

  beforeEach(() => {
    service = new ABTestingService();
  });

  it('should assign a user to a variant consistently', () => {
    const userId = 'test-user';
    const testName = 'tarot_inference';
    const variant1 = service.assignTestVariant(userId, testName);
    const variant2 = service.assignTestVariant(userId, testName);
    expect(variant1).toBe(variant2);
  });

  it('should return "default" for a test with no configured variants', () => {
    const variant = service.assignTestVariant('user1', 'non_existent_test');
    expect(variant).toBe('default');
  });

  it('should not set a configuration if weights do not sum to 1', () => {
    const testName = 'invalid_test';
    const variants = [
      { id: 'A', weight: 0.6 },
      { id: 'B', weight: 0.5 },
    ];
    const result = service.setTestConfiguration(testName, variants);
    expect(result).toBe(false);
    expect(service.getTestVariants(testName)).toEqual([]);
  });

  it('should correctly calculate results', () => {
    const testName = 'results_test';
    service.setTestConfiguration(testName, [
      { id: 'A', weight: 0.5 },
      { id: 'B', weight: 0.5 },
    ]);

    service.recordResult({ userId: 'u1', testName, variantId: 'A', success: true, metrics: { time: 10 } });
    service.recordResult({ userId: 'u2', testName, variantId: 'B', success: false, metrics: { time: 20 } });
    service.recordResult({ userId: 'u3', testName, variantId: 'A', success: true, metrics: { time: 12 } });

    const results = service.getTestResults(testName);
    expect(results.resultsByVariant['A'].totalCount).toBe(2);
    expect(results.resultsByVariant['A'].successCount).toBe(2);
    expect(results.resultsByVariant['A'].successRate).toBe(100);
    expect(results.resultsByVariant['A'].metrics.time.average).toBe(11);
    expect(results.resultsByVariant['B'].totalCount).toBe(1);
    expect(results.resultsByVariant['B'].successCount).toBe(0);
  });
});
