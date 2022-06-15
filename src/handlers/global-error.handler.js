const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  // TODO logger service status

  const errors = [];

  if (error.errors && error.isParamsError) {
    const mappedValidationErrors = _.map(
      error.errors,
      ({ msg, param, value }) => ({
        code: `invalid_parameters`,
        msg: `${msg} (${param}=${value})`,
      })
    );

    errors.push(...mappedValidationErrors);
  } else if (error.errors && _.get(error, 'errors.0.origin') === 'DB') {
    // db validation error
    const mappedDbErrors = _.map(error.errors, ({ message }) => {
      return {
        code: 'database_errors',
        msg: message,
      };
    });
    error.statusCode = 400; // Bad request
    errors.push(...mappedDbErrors);
  } else if (error.isGenericError) {
    // throw new GenericError(statusCode, code, message, data)
    errors.push({
      code: error.code,
      msg: error.message || 'Unknown Error',
      data: error.data,
    });
  } else {
    // unknown error
    error.statusCode = 500;
    errors.push({
      code: 'unknown_errors',
      msg: error.message || 'Unknown Error',
    });
  }

  res.status(error.statusCode || 500).json({
    status: false,
    errors,
  });
  // next() // (optional) invoking next middleware
};
