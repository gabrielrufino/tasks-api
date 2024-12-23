import http from 'http';

import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import pino from 'pino-http';

import { database } from './database';
import { router } from './routers/tasks.router';

const {
  JWT_SECRET = 'SOMETHING_REALLY_SECRET',
} = process.env;

passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  }, (payload, done) => {
    const owner = { id: payload.sub };
    done(null, owner);
  }),
);

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(helmet());
app.use(pino());

app.get('/health', async (_request, response) => response.json({
  server: server.listening,
  database: await database.isConnected(),
}));

app.use('/tasks', passport.authenticate('jwt', { session: false }), router);

export { server };
