/**
 *
 * @param statusCode {number}
 * @param code {string}
 * @param msg {string}
 * @param data {null|any}
 * @returns {Error}
 * @constructor
 */
function GenericError(statusCode, code, msg, data = null) {
  const error = new Error(msg);
  error.statusCode = statusCode;
  error.code = code;
  error.data = data;
  error.isGenericError = true;
  return error;
}

module.exports = GenericError;
