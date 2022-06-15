const _ = require('lodash');
const { Op } = require('sequelize');
const { isUUID } = require('validator');

const operatorMap = {
  '>=': {
    symbol: Op.gte,
    prepare: (val) => val,
  },
  '<=': {
    symbol: Op.lte,
    prepare: (val) => val,
  },
  '!~': {
    symbol: Op.notILike,
    prepare: (value) => `%${value}%`,
  },
  '!=': {
    symbol: Op.not,
    prepare: (val) => val,
  },
  '~': {
    symbol: Op.iLike,
    prepare: (value) => `%${value}%`,
  },
  '>': {
    symbol: Op.gt,
    prepare: (val) => val,
  },
  '<': {
    symbol: Op.lt,
    prepare: (val) => val,
  },
  '=': {
    symbol: Op.eq,
    prepare: (val) => val,
  },
};

const filterParser = (filters) => {
  const where = {};

  filters = filters && String(filters).split(/\|/g);

  for (const filter of filters || []) {
    const parsed = /([a-z_]+)(>=|<=|!=|!~|~|<|>|=)(.+)/.exec(filter);
    if (parsed) {
      const [, column_name, operator, value] = parsed;

      if (!(operator in operatorMap)) {
        continue;
      }

      const { symbol, prepare } = operatorMap[operator];

      where[column_name] = {
        [symbol]: prepare(value),
      };
    }
  }

  return where;
};

const searchParse = ({ text, likeColumn, enums }) => {
  if (_.startsWith(likeColumn, 'uuid:')) {
    if (isUUID(text)) {
      return {
        [likeColumn.substr(5)]: text,
      };
    }
    // skip is not valid UUID
  } else if (_.startsWith(likeColumn, 'enum:')) {
    const column = likeColumn.substr(5);

    if (_.values(enums[column]).includes(text)) {
      return {
        [column]: text,
      };
    }
    // skip is not valid enum
  } else {
    return {
      [likeColumn]: {
        [Op.substring]: `${text}`,
      },
    };
  }

  return null;
};

const searchParser = ({ q, likeColumns, enums }) => {
  if (!q) {
    return [];
  }

  const orConditions = [];

  const query = String(q).split(' ');

  for (const parsedQ of query) {
    for (const likeColumn of likeColumns) {
      const prepared = searchParse({
        text: parsedQ,
        likeColumn,
        enums,
      });

      if (prepared) {
        orConditions.push(prepared);
      }
    }
  }

  return orConditions;
};

/**
 * filter = column_name=value|column_name<value|column_name>=value
 *
 * @param where {object}
 * @param pagination {{q: null, orderType: string, offset: number, limit: number, orderColumn: string, filters: string}}
 * @param likeColumns {array<string>}
 * @param enums
 * @param disableSearch
 * @returns {{offset, limit: *, raw: boolean, where: {status: boolean}, order: (string)[][]}}
 */
const paginationOptionGenerator = ({
  where = {},
  pagination,
  likeColumns = [],
  enableSearch = true,
  enums = {},
}) => {
  const defaultWhere = {
    ...filterParser(pagination.filters),
  };

  const orConditions = searchParser({
    q: pagination.q,
    likeColumns,
    enums,
  });

  if (enableSearch && orConditions.length) {
    defaultWhere[Op.or] = orConditions;
  }

  return {
    where: {
      ...defaultWhere,
      ...where,
    },
    raw: false,
    limit: pagination.limit,
    offset: pagination.offset,
    order: [[pagination.orderColumn, pagination.orderType]],
  };
};

module.exports = paginationOptionGenerator;
