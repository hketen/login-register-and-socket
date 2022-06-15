/**
 * @param query
 * @returns {{q: null, orderType: string, offset: number, limit: number, orderColumn: string, filters: string}}
 */
const paginationQueryParser = (query) => {
  // When the query string is parsed, the numbers come as strings.
  // ?limit=10&page=2&order=id:asc&q=search-text&filters=column_name=value|column_name>=value
  const {
    limit = '10',
    q = null,
    page = '1',
    order = 'id:asc',
    filters = null,
  } = query || {};

  const [orderColumn = 'id', orderType = 'asc'] = String(order).split(':');
  return {
    filters,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    q,
    orderColumn,
    orderType,
  };
};

module.exports = paginationQueryParser;
