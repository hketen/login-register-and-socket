const { newClient } = require('../utils/redis-client');
const CHANNEL = require('../constants/channel');

/**
 *
 * @param io
 * @returns {Promise<void>}
 */
module.exports = async (io) => {
  const redis = newClient();
  redis.on('message', (channel, message) => {
    io.emit(channel, message);
  });

  redis.subscribe(CHANNEL.ONLINE);
  redis.subscribe(CHANNEL.OFFLINE);
  redis.subscribe(CHANNEL.REGISTER);
};
