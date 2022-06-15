const { DataTypes } = require('sequelize');

/**
 *
 * @param queryInterface {object}
 * @param tableName {string}
 * @param attributeName {string}
 * @param attributeOptions {object}
 * @param replaces {object} Key value object {oldValue: newValue}
 * @param enumName {string} Optional (auto-generating)
 * @returns {Promise<void>}
 */
const replaceEnum = async ({
  queryInterface,
  tableName,
  attributeName,
  attributeOptions,
  replaces = {},
  enumName = `enum_${tableName}_${attributeName}`,
}) => {
  return queryInterface.sequelize.transaction(async (t) => {
    const opts = {
      transaction: t,
    };

    await queryInterface.changeColumn(
      tableName,
      attributeName,
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
      opts
    );

    for (const [oldValue, newValue] of Object.entries(replaces || {})) {
      await queryInterface.sequelize.query(
        `UPDATE ${tableName} SET ${attributeName}='${newValue}' WHERE ${attributeName}='${oldValue}'`,
        opts
      );
    }

    // drop exists enum
    await queryInterface.sequelize.query(`DROP TYPE "${enumName}"`, opts);

    await queryInterface.changeColumn(
      tableName,
      attributeName,
      attributeOptions,
      opts
    );
  });
};

module.exports = replaceEnum;
