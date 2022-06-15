const express = require('express');
const router = express.Router();

const userService = require('../services/user.service');
const validatorMiddleware = require('../middlewares/validator-middleware');
const { body, header, param } = require('express-validator');
const paginationMiddleware = require('../middlewares/pagination-middleware');
const auth = require('../middlewares/auth');

/**
 * User Model
 * @typedef {object} User
 * @property {string} user_id - User id (UUID)
 * @property {string} name - Name
 * @property {string} surname - Surname
 * @property {string} email - Email
 */

/**
 * @typedef {object} GetUserList
 * @property {boolean} status - Service status
 * @property {number} count - Total brand count (included where expression)
 * @property {array<User>} data - Brand list
 */

/**
 * GET /users
 * @summary Get users
 * @tags Users
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {string} q.query - search text
 * @param {string} filters.query - filters (operator: >=, <=, !~, !=, ~, >, <, =) example: filters=column_name=value|column_name>=value
 * @param {string} order.query - order field - example: created_at:desc
 * @param {number} page.query - get page
 * @param {number} limit.query - per page count
 * @return {GetUserList} 200 - success response - application/json
 */
router.get(
  '/',
  ...auth(),
  validatorMiddleware(header('lng').isIn(['en', 'tr'])),
  paginationMiddleware(),
  async (req, res, next) => {
    try {
      const result = await userService.getUsers(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);
/**
 * @typedef {object} GetUser
 * @property {boolean} status - Service status
 * @property {User} data - User
 */

/**
 * GET /users/{user_id}
 * @summary Get users
 * @tags Users
 * @security bearerAuth
 * @param {string} lng.header.required - language - enum:en,tr
 * @param {string} user_id.path.required - user uuid
 * @return {GetUser} 200 - success response - application/json
 */
router.get(
  '/:user_id',
  ...auth(),
  validatorMiddleware(
    header('lng').isIn(['en', 'tr']),
    param('user_id').isUUID('4')
  ),
  paginationMiddleware(),
  async (req, res, next) => {
    try {
      const result = await userService.getUser(req);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
