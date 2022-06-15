const jwt = require('jsonwebtoken');
const _ = require('lodash');
const moment = require('moment-timezone');

module.exports = {
  /**
   *
   * @param {object} jwtPayload - auto clear iat, exp and iss values, required customer_id and customer_token_id for refresh_token
   * @returns {{refresh_token: string, access_token: string}}
   */
  createJwt: (jwtPayload) => {
    try {
      const access_token = jwt.sign(
        {
          access_token: true,
          ..._.omit(jwtPayload, ['iat', 'exp']),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
        }
      );
      const refresh_token = jwt.sign(
        {
          refresh_token: true,
          user_id: jwtPayload.user_id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
        }
      );

      return { access_token, refresh_token };
    } catch (e) {
      console.error('createJwt error: ', e);
      throw e;
    }
  },

  /**
   *
   * @param token
   * @param useVerify
   * @returns {null|*}
   */
  getJwtPayload: (token, useVerify = true) => {
    try {
      return useVerify
        ? jwt.verify(token, process.env.JWT_SECRET)
        : jwt.decode(token);
    } catch (e) {
      console.error('getJwtPayload error: ', e.message);
      return null;
    }
  },

  /**
   *
   * @param token
   * @returns {*|moment}
   */
  getTokenExpires: (token) => {
    try {
      const accessToken = jwt.verify(token, process.env.JWT_SECRET);

      return moment.utc().add(accessToken.exp / 1000, 'milliseconds');
    } catch (e) {
      console.error('getTokenExpires error: ', e.message);
      return null;
    }
  },
};
