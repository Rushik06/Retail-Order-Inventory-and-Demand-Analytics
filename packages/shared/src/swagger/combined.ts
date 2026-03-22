import swaggerUi from 'swagger-ui-express';
import type { Express, RequestHandler } from 'express';

export const initCombinedSwagger = (app: Express) => {
  app.use(
    '/api-docs',
    swaggerUi.serve as unknown as RequestHandler[],
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        urls: [
          {
            url: 'http://localhost/docs/swagger.json',
            name: 'Auth Service'
          },
          {
            url: 'http://localhost/product/docs/swagger.json',
            name: 'Product Service'
          },
          {
            url: 'http://localhost/inventory/docs/swagger.json',
            name: 'Inventory Service'
          },
          {
            url: 'http://localhost/reporting/docs/swagger.json',
            name: 'Reporting Service'
          }
        ]
      }
    }) as unknown as RequestHandler
  );
};