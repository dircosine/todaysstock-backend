import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import cors from 'cors';
import schema from './schema';

import { updateTodaysInfos } from './routes/tournament';

const app = express();
const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],
});

app.use('*', cors());
server.applyMiddleware({ app, path: '/graphql' });

app.get('/update', updateTodaysInfos);

const httpServer = createServer(app);
httpServer.listen({ port: 4000 }, (): void =>
  console.log(
    `\n🚀      GraphQL is now running on http://localhost:4000/graphql`,
  ),
);
