'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      const opts = {
        transaction: t,
      };

      // country table
      await queryInterface.createTable(
        'user',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT,
          },
          user_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          name: {
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          surname: {
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING(255),
            allowNull: false,
          },
          country: {
            type: DataTypes.STRING(100),
            allowNull: false,
          },
          lng: {
            type: DataTypes.STRING(2),
            allowNull: false,
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
        },
        opts
      );
      await queryInterface.addIndex('user', ['id', 'user_id'], opts);
      await queryInterface.addIndex('user', ['email'], opts);
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      const opts = {
        transaction: t,
      };

      // remove user table
      await queryInterface.dropTable('user', opts);
    });
  },
};
