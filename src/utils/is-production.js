const isProduction = (process.env.NODE_ENV || 'development') === 'production';
module.exports = isProduction;
