const paginationQueryParser = require('../utils/pagination-query-parser');
const { query } = require('express-validator');

/**
 *
 * @param valueSetName
 * @returns {(function(Request, Response, NextFunction): void)|*}
 */
const paginationMiddleware = (valueSetName = 'pagination') => {
  return [
    query('filters').optional().isString(),
    query('limit').optional().isString(),
    query('page').optional().isNumeric(),
    query('order').optional().isString(),
    query('q').optional().isString(),
    (req, res, next) => {
      req[valueSetName] = paginationQueryParser(req.query);
      next();
    },
  ];
};

module.exports = paginationMiddleware;
