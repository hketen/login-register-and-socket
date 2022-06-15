const { redis } = require('../utils/redis-client');
const GenericError = require('../utils/generic-error');

const forbidden = new GenericError(
  403,
  'forbidden',
  `This token session has been closed.`
);

const logoutControlMiddleware = async (req, res, next) => {
  const position = await redis.lpos('login_user_tokens', req.TOKEN);

  if (position !== null && position >= 0) {
    return next();
  }

  next(forbidden);
};

module.exports = logoutControlMiddleware;
