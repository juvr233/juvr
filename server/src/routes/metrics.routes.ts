import { Router } from 'express';
import * as metricsController from '../controllers/metrics.controller';
import { isAdmin } from '../middleware/auth.middleware';
import { apiKeyAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route GET /api/metrics/prometheus
 * @desc Get metrics in Prometheus format
 * @access Admin or API Key
 */
router.get(
  '/prometheus',
  apiKeyAuth,
  metricsController.getPrometheusMetrics
);

/**
 * @route GET /api/metrics/health
 * @desc Get application health metrics
 * @access Admin
 */
router.get(
  '/health',
  isAdmin,
  metricsController.getHealthMetrics
);

/**
 * @route GET /api/metrics/requests
 * @desc Get request metrics
 * @access Admin
 */
router.get(
  '/requests',
  isAdmin,
  metricsController.getRequestMetrics
);

/**
 * @route GET /api/metrics/resources
 * @desc Get resource usage metrics
 * @access Admin
 */
router.get(
  '/resources',
  isAdmin,
  metricsController.getResourceMetrics
);

export default router; 