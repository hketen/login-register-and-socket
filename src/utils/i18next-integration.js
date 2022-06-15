const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');

/**
 *
 * @param app
 * @returns {Promise<void>}
 */
const i18nextIntegration = async (app) => {
  await i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
      fallbackLng: process.env.FALLBACK_LANG || 'en',
      backend: {
        loadPath: path.join(__dirname, '..', '/locales/{{lng}}.json'),
      },
    });

  app.use(middleware.handle(i18next));
};

module.exports = i18nextIntegration;
