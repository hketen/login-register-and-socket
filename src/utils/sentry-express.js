const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const isProduction = require('./is-production');

const dsn = process.env.SENTRY_DSN;
const isActive = isProduction && !!dsn;

module.exports = {
  init: (app) => {
    if (!isActive) {
      return;
    }

    Sentry.init({
      dsn,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });

    app.use(
      Sentry.Handlers.requestHandler({
        // // keys to be extracted from req
        // request?: boolean | string[]; // default: true = ['cookies', 'data', 'headers', 'method', 'query_string', 'url']
        // // server name
        // serverName?: boolean; // default: true
        // // generate transaction name
        // //   path == request.path (eg. "/foo")
        // //   methodPath == request.method + request.path (eg. "GET|/foo")
        // //   handler == function name (eg. "fooHandler")
        // transaction?: boolean | 'path' | 'methodPath' | 'handler'; // default: true = 'methodPath'
        // // keys to be extracted from req.user
        // user?: boolean | string[]; // default: true = ['id', 'username', 'email']
        // // client ip address
        // ip?: boolean; // default: false
        // // node version
        // version?: boolean; // default: true
        // // timeout for fatal route errors to be delivered
        // flushTimeout?: number; // default: undefined
        ip: true,
        flushTimeout: 10,
      })
    );
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
  },
  errorHandler: (app) => {
    if (!isActive) {
      return;
    }

    app.use(Sentry.Handlers.errorHandler());
  },
};
