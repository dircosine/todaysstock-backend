import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import cors from 'cors';
import schema from './schema';
import './env';

import { updateTodaysInfos } from './routes/tournament';

const PORT = process.env.PORT || 4000;

const app = express();
const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],
  playground: true,
});

app.use('*', cors());
server.applyMiddleware({ app, path: '/graphql' });

app.get('/', (req, res) => {
  res.send('호잇!');
});
app.get('/update', updateTodaysInfos);

const httpServer = createServer(app);
httpServer.listen({ port: PORT }, (): void =>
  console.log(
    `\n🚀      GraphQL is now running on http://localhost:${PORT}/graphql`,
  ),
);
