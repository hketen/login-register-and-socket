const GenericError = require('../utils/generic-error');

const forbidden = new GenericError(
  403,
  'forbidden',
  `You can only access '/auth/refresh' endpoint with the refresh token.`
);

const refreshControlMiddleware = (req, res, next) => {
  const isRefreshRoute = /\/auth\/refresh/.test(req.originalUrl);

  if (req.AUTH.refresh_token && !isRefreshRoute) {
    return next(forbidden);
  }

  next();
};

module.exports = refreshControlMiddleware;
