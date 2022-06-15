const GenericError = require('../utils/generic-error');
const cryptoService = require('./crypto.service');
const userService = require('./user.service');
const { redis } = require('../utils/redis-client');
const REDIS_EVENT = require('../constants/channel');

/**
 *
 * @param req
 * @returns {Promise<*>}
 */
async function login(req) {
  const { email, password } = req.body || {};

  const user = await userService.getUserWithParams({ email });

  if (!user) {
    throw new GenericError(400, 'user_not_found', `User not found.`);
  }

  if (!cryptoService.isEqualHashedPassword(password, user.password)) {
    throw new GenericError(400, 'password_wrong', `The password is wrong.`);
  }

  const { access_token, refresh_token } = await userService.createUserJwt(
    req,
    user
  );

  // add user_id in login user ids
  await redis.lpush('login_user_tokens', access_token);

  // send online event
  await redis.publish(REDIS_EVENT.ONLINE, `${user.name} is online!`);

  return {
    status: true,
    access_token,
    refresh_token,
  };
}

/**
 *
 * @param req
 * @returns {Promise<void>}
 */
async function refreshToken(req) {
  const user = await userService.getUserWithParams({
    user_id: req.AUTH.user_id,
  });

  if (!user) {
    throw new GenericError(400, 'user_not_found', `User not found.`);
  }

  const { access_token, refresh_token } = await userService.createUserJwt(
    req,
    user
  );

  return {
    status: true,
    access_token,
    refresh_token,
  };
}

/**
 *
 * @param req
 * @returns {Promise<*>}
 */
async function logout(req) {
  // remove user_id in login user ids
  await redis.lrem('login_user_tokens', 1, req.TOKEN);

  // send offline event
  await redis.publish(REDIS_EVENT.OFFLINE, `${req.AUTH.name} is new user!`);

  return {
    status: true,
  };
}

/**
 *
 * @param req
 * @returns {Promise<*>}
 */
async function register(req) {
  const { email } = req.body || {};

  const user = await userService.getUserWithParams({ email });

  if (user) {
    throw new GenericError(400, 'user_exists', `The user exists`);
  }

  await userService.createUser(req);

  redis.publish(REDIS_EVENT.REGISTER, `${user.name} is new user!`);

  return {
    status: true,
  };
}

module.exports = {
  login,
  refreshToken,
  logout,
  register,
};
