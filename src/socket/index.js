const subscribers = require('./subscribers');
const createIO = require('./create-io');

/**
 *
 * @param app
 * @returns {Promise<void>}
 */
module.exports = async (app) => {
  const io = await createIO(app);
  await subscribers(io);
};
