'use strict';
/*
 * how to use!
 *
 * for example Customer model in models/customer.js
 *
 * const Customer = require('./customer');
 *
 * module.exports = {
 *   Customer,
 *   ...OtherModels
 * };
 */

const { User } = require('./user');

module.exports = {
  User,
};
