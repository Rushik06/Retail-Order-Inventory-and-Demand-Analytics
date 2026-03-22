import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express, RequestHandler } from 'express';

interface SwaggerConfig {
  title: string;
  version: string;
  description: string;
  serverUrl: string;
  apis: string[];
}

export const createSwagger = (config: SwaggerConfig) => {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: config.title,
        version: config.version,
        description: config.description
      },
      servers: [
        {
          url: config.serverUrl
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    },
    apis: config.apis
  };

  return swaggerJsdoc(options);
};

export const setupSwagger = (app: Express, config: SwaggerConfig) => {
  const spec = createSwagger(config);

  app.get('/docs/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(spec);
  });


  app.use(
    '/docs',
    swaggerUi.serve as unknown as RequestHandler[],
    swaggerUi.setup(spec) as unknown as RequestHandler
  );
};