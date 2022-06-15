/*
 * JSDoc documentation
 * https://www.npmjs.com/package/express-jsdoc-swagger
 */

const path = require('path');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const packageJson = require(process.env.npm_package_json);
const YAML = require('json-to-pretty-yaml');

const options = {
  info: {
    version: process.env.npm_package_version,
    title: process.env.npm_package_name,
    description: packageJson.description || '',
    license: {
      name: packageJson.license || 'MIT',
    },
  },
  security: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  baseDir: path.join(__dirname, '..', 'controllers'),
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './**/*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/api-docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: true,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/swagger.json',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {
    swaggerOptions: {
      docExpansions: "none",
      persistAuthorization: true
    },
  },
  // multiple option in case you want more that one instance
  multiple: true,
};

const yamlRoute = (app, swaggerObject) => {
  app.get('/swagger.yaml', async (req, res) => {
    try {
      const data = YAML.stringify(swaggerObject);

      // boolean string
      if (req.query.download === 'true') {
        res.attachment('swagger.yaml');
      }

      res.set('Content-Type', 'text/plain').send(data);
    } catch (e) {
      return res.status(500).send(`Internal Error: ${e.message}`);
    }
  });
};

const swagger = (app) => {
  return new Promise((resolve) => {
    const listener = expressJSDocSwagger(app)(options);

    // Event emitter API
    listener.on('error', (error) => {
      console.error(`Error: ${error}`);
    });

    listener.on('finish', (swaggerObject) => {
      yamlRoute(app, swaggerObject);
      resolve();
    });
  });
};

module.exports = swagger;
