import { Server } from 'http';
import os from 'os';
import path from 'path';

import { faker } from '@faker-js/faker';
import request from 'supertest';
import {
  describe, it, beforeAll, afterAll,
} from 'vitest';

import type { Database } from '../src/config/database';

describe('Healthcheck', () => {
  let database: Database;
  let server: Server;

  beforeAll(async () => {
    process.env = {
      ...process.env,
      DATABASE_URI: path.join(os.tmpdir(), '@servicespack/tasks-api', faker.string.alpha()),
      JWT_SECRET: faker.lorem.word(),
    };

    database = (
      await import(path.join(__dirname, '..', 'src', 'config', 'database'))
    ).database;
    await database.init();

    server = (
      await import(path.join(__dirname, '..', 'src', 'http.server'))
    ).server;
  });

  afterAll(async () => {
    await database.close();
  });

  it('Should return the correct response in the ideal case', async () => request(server)
    .get('/health')
    .expect(200, {
      server: true,
      database: true,
    }));
});
