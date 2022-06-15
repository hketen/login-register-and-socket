const { validationResult } = require('express-validator');
/**
 *
 * @param args validator functions
 */
const validatorMiddleware = (...args) => {
  return [
    ...args,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next({
          isParamsError: true,
          statusCode: 400,
          errors: errors.array(),
        });
      }

      next();
    },
  ];
};

module.exports = validatorMiddleware;
