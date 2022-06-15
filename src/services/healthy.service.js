async function index() {
  return {
    status: true,
    service: process.env.npm_package_name,
    uptime: process.uptime(),
  };
}

async function healthy() {
  return {
    status: true,
  };
}

module.exports = {
  index,
  healthy,
};
