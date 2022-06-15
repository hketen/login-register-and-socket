const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize-client');

module.exports = async () => {
  const umzug = new Umzug({
    storage: new SequelizeStorage({
      sequelize,
    }),
    migrations: {
      glob: path.join(__dirname, '..', 'migrations/*.js'),
      resolve: ({ name, path }) => {
        const queryInterface = sequelize.getQueryInterface();
        const migration = require(path);
        return {
          // adjust the parameters Umzug will
          // pass to migration methods when called
          name,
          up: async () => migration.up(queryInterface, DataTypes),
          down: async () => migration.down(queryInterface, DataTypes),
        };
      },
    },
  });

  await umzug.up();
  console.log('Sequelize Migration Done.');
};
