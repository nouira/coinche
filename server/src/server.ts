import { Server } from 'boardgame.io/server';
import { get } from 'koa-route';
import { game as contreGame } from '../../client/src/shared/contre';

export const server = Server({ games: [contreGame] });

server.app.use(get('/healthz', ({ res }) => {
  res.statusCode = 200;
}));
