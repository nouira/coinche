import { Server } from 'boardgame.io/server';
import { get } from 'koa-route';
import { game as coincheGame } from '../../client/src/shared/coinche';
import { game as contreGame } from '../../client/src/shared/contre';

export const server = Server({ games: [coincheGame, contreGame] });

server.app.use(get('/healthz', ({ res }) => {
  res.statusCode = 200;
}));
