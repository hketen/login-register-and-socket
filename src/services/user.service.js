const { User } = require('../models');
const _ = require('lodash');
const jwt = require('../utils/jwt');
const GenericError = require('../utils/generic-error');
const cryptoService = require('./crypto.service');
const paginationOptionGenerator = require('../utils/pagination-option-generator');
const { redis } = require('../utils/redis-client');
const { Op } = require('sequelize');

/**
 *
 * @param req {Request}
 * @returns {Promise<{data: *, status: boolean}>}
 */
async function getUsers({ pagination }) {
  /*
   * test uygulaması olduğu için çok fazla yüke dayanacak bir kod yazmıyorum.
   * ihtiyaç dahilinde iyi bir analizle güzel sonuçlar elde edilebilir.
   *
   * zaman ve verim önemli kriterdir. :)
   */
  const user_tokens = await redis.lrange('login_user_tokens', 0, -1);
  const user_ids = _.chain(user_tokens)
    .map((userToken) => {
      const user = jwt.getJwtPayload(userToken, false);
      return user.user_id;
    })
    .uniq()
    .value();

  const options = paginationOptionGenerator({
    pagination,
    likeColumns: ['uuid:user_id', 'name', 'surname', 'email', 'country', 'lng'],
    where: {
      user_id: {
        [Op.in]: user_ids,
      },
    },
  });

  const count = await User.count({
    where: options.where,
  });

  const data = await User.findAll(options);

  return {
    status: true,
    count,
    data,
  };
}

/**
 *
 * @param req {Request}
 * @returns {Promise<{data: *, status: boolean}>}
 */
async function getUser({ params }) {
  return {
    status: true,
    data: await User.findOne({
      attributes: ['user_id', 'name', 'surname', 'email', 'country', 'lng'],
      where: {
        user_id: params.user_id,
      },
      raw: true,
    }),
  };
}

/**
 *
 * @param req
 * @returns {Promise<any>}
 */
async function getUserWithParams({ user_id, email }) {
  const where = {};

  if (!_.isEmpty(user_id)) {
    where.user_id = user_id;
  }

  if (!_.isEmpty(email)) {
    where.email = email;
  }

  return User.findOne({ where });
}

/**
 *
 * @param req Request
 * @param user User
 * @returns {Promise<{refresh_token: string, access_token: string}>}
 */
async function createUserJwt(req, user) {
  const { access_token, refresh_token } = jwt.createJwt({
    user_id: user.user_id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  });

  return { access_token, refresh_token };
}

/**
 *
 * @param req
 * @returns {Promise<any>}
 */
async function createUser(req) {
  const { email, name, surname, password, country } = req.body || {};

  const user = await getUserWithParams({ email });

  if (user) {
    throw new GenericError(403, 'username_is_exists', 'Username is exists');
  }
  await User.create({
    name,
    surname,
    email,
    country,
    lng: req.headers.lng,
    password: cryptoService.hashPassword(password),
  });

  return {
    status: true,
  };
}

module.exports = {
  getUsers,
  getUser,
  getUserWithParams,
  createUser,
  createUserJwt,
};
