const express = require('express');
const router = express.Router();

const healthyService = require('../services/healthy.service');

/**
 * Healthy result type
 * @typedef {object} Healthy
 * @property {boolean} status - Healthy status
 */

/**
 * Service control
 * @typedef {object} Service
 * @property {boolean} status - Healthy status
 * @property {string} service - Service Name
 * @property {number} uptime - Service Uptime
 */

/**
 * GET /
 * @summary Service checking endpoint
 * @tags Service Status
 * @return {Service} 200 - success response - application/json
 */
router.get('/', async (req, res) => {
  const result = await healthyService.index(req, res);
  res.status(200).json(result);
});

/**
 * GET /healthy
 * @summary Healthy checking endpoint
 * @tags Service Status
 * @return {Healthy} 200 - success response - application/json
 */
router.get('/healthy', async (req, res) => {
  const result = await healthyService.healthy();
  res.status(200).json(result);
});

module.exports = router;
