const http = require('http');
const { Server } = require('socket.io');
/**
 *
 * @param app
 * @returns {Promise<void>}
 */
module.exports = async (app) => {
  const { SOCKET_PORT } = process.env;
  const server = http.createServer(app);

  const io = new Server(server);

  server.listen(SOCKET_PORT);
  console.log(`Socket: http://localhost:${SOCKET_PORT}`);

  return io;
};
