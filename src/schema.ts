import 'graphql-import-node';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

import * as comment from './graphql/comment';
import * as tournament from './graphql/tournament';
import { gql } from 'apollo-server-express';

const defaultType = gql`
  type Query {
    _version: String
  }

  type Mutation {
    _empty: String
  }
`;

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [defaultType, comment.typeDef, tournament.typeDef],
  resolvers: [comment.resolers, tournament.resolers],
});

export default schema;
