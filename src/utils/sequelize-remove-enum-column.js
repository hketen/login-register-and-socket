/**
 *
 * @param queryInterface {object}
 * @param tableName {string}
 * @param attributeName {string}
 * @param enumName {string} Optional (auto-generating)
 * @returns {Promise<void>}
 */
const removeEnumColumn = async ({
  queryInterface,
  tableName,
  attributeName,
  enumName = `enum_${tableName}_${attributeName}`,
}) => {
  return queryInterface.sequelize.transaction(async (t) => {
    const opts = {
      transaction: t,
    };

    await queryInterface.removeColumn(tableName, attributeName, opts);

    // drop enum
    await queryInterface.sequelize.query(`DROP TYPE "${enumName}"`, opts);
  });
};

module.exports = removeEnumColumn;
