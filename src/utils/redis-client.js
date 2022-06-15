const IORedis = require('ioredis');

const newClient = () => {
  const client = new IORedis(process.env.REDIS_URI);

  const maxListener = process.env.REDIS_MAX_LISTENER_COUNT
    ? parseInt(process.env.REDIS_MAX_LISTENER_COUNT)
    : 25;

  client.setMaxListeners(maxListener);

  return client;
};
/**
 *
 * @type {any}
 */
module.exports = { redis: newClient(), newClient };
