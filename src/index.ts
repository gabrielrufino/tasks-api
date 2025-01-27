import { database } from './config/database';
import { logger } from './config/logger';
import { server } from './http.server';

async function main() {
  const {
    HTTP_SERVER_ENABLED = 'true',
    HTTP_SERVER_PORT = 3000,
  } = process.env;

  await database.init();
  logger.info('Connected to the database');

  if (HTTP_SERVER_ENABLED === 'true') {
    server.listen(HTTP_SERVER_PORT, () => { logger.info(`Server listening on ${HTTP_SERVER_PORT}`); });
  }

  process
    .on('unhandledRejection', logger.error)
    .on('uncaughtException', logger.error)
    .on('SIGTERM', async () => {
      server.close();
      await database.close();
    });
}

main();
