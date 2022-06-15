const _ = require('lodash');
const GenericError = require('../utils/generic-error');
const forbidden = new GenericError(
  403,
  'forbidden',
  'You are not authorized to access!'
);

const accessControlMiddleware = (permission_code) => {
  return (req, res, next) => {
    if (!permission_code) {
      return next();
    }

    const permissions = _.get(req.AUTH, 'permissions', []);

    const isPermitted = _.includes(permissions, permission_code);

    if (!isPermitted) {
      return next(forbidden);
    }

    next();
  };
};

module.exports = accessControlMiddleware;
