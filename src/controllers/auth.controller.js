const express = require('express');
const router = express.Router();

const authService = require('../services/auth.service');
const validatorMiddleware = require('../middlewares/validator-middleware');
const { body, header } = require('express-validator');
const auth = require('../middlewares/auth');

/**
 * @typedef {object} JwtResponse
 * @property {string} status - true
 * @property {string} access_token - Jwt Token
 * @property {string} refresh_token - Refresh Token
 */

/**
 * @typedef {object} LoginBody
 * @property {string} email - Username
 * @property {string} password - Password
 */

/**
 * POST /auth/login
 * @summary Log in
 * @tags Auth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {LoginBody} request.body.required - Login body
 * @return {JwtResponse} 200 - success response - application/json
 */

router.post(
  '/login',
  validatorMiddleware(
    header('lng').isIn(['en', 'tr']),
    body('email').isEmail(),
    body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)
  ),
  async (req, res, next) => {
    try {
      const result = await authService.login(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * POST /auth/refresh
 * @summary Refresh token
 * @tags Auth
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr,ae
 * @return {JwtResponse} 200 - success response - application/json
 */
router.post(
  '/refresh',
  ...auth(),
  validatorMiddleware(header('lng').isIn(['en', 'tr'])),
  async (req, res, next) => {
    try {
      const result = await authService.refreshToken(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * POST /auth/logout
 * @summary Refresh token
 * @tags Auth
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr,ae
 * @return {JwtResponse} 200 - success response - application/json
 */
router.post(
  '/logout',
  ...auth(),
  validatorMiddleware(header('lng').isIn(['en', 'tr'])),
  async (req, res, next) => {
    try {
      const result = await authService.logout(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @typedef {object} RegisterBody
 * @property {string} name - Name
 * @property {string} surname - Surname
 * @property {string} email - Email
 * @property {string} country - Country
 * @property {string} password - Password
 * @property {string} password_again - Password Again
 */

/**
 * POST /auth/register
 * @summary Register
 * @tags Auth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {RegisterBody} request.body.required - Login body
 * @return {JwtResponse} 200 - success response - application/json
 */

router.post(
  '/register',
  validatorMiddleware(
    header('lng').isIn(['en', 'tr']),
    body('name').isString().isLength({ min: 2, max: 100 }),
    body('surname').isString().isLength({ min: 2, max: 100 }),
    body('email').isEmail(),
    body('country').isString().isLength({ min: 2, max: 100 }),
    body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/),
    body('password_again', 'Password and password again are not equals')
      .isString()
      .custom((value, { req: { body } }) => value === body.password)
  ),
  async (req, res, next) => {
    try {
      const result = await authService.register(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
