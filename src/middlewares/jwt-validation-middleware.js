const jwt = require('../utils/jwt');
const GenericError = require('../utils/generic-error');

const jwtValidationMiddleware = (req, res, next) => {
  const {
    headers: { authorization },
  } = req;

  if (!authorization) {
    const error = new GenericError(
      400,
      'authorization_not_found',
      '`authorization` field not found in header.'
    );
    return next(error);
  }

  const token = authorization && authorization.split(' ')[1];

  if (!token) {
    const error = new GenericError(
      400,
      'token_not_found_in_authorization',
      'The Parsed Token not found in header.'
    );
    return next(error);
  }

  req.TOKEN = token;
  req.AUTH = jwt.getJwtPayload(token);

  if (!req.AUTH) {
    const error = new GenericError(
      401,
      'invalid_access_token',
      'The access token is not valid'
    );
    return next(error);
  }

  next();
};

module.exports = jwtValidationMiddleware;
