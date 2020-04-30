// schema.ts
import 'graphql-import-node';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

import * as dataModel from './graphql/dataModel.graphql';
import * as comment from './graphql/comment';
import * as tournament from './graphql/tournament';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [dataModel, comment.typeDef, tournament.typeDef],
  resolvers: [comment.resolers, tournament.resolers],
});

export default schema;
