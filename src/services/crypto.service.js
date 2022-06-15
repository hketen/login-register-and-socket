const crypto = require('crypto-js');

function hashPassword(pass) {
  return crypto.HmacSHA256(pass, process.env.USER_PASSWORD_SECRET).toString();
}

function isEqualHashedPassword(pass, hashedPassword) {
  return hashPassword(pass) === hashedPassword;
}

module.exports = {
  hashPassword,
  isEqualHashedPassword,
};
