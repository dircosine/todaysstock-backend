import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

import * as tournament from './graphql/tournament';
import * as comment from './graphql/comment';
import * as user from './graphql/user';
import * as tournamentResult from './graphql/tournamentResult';
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
  typeDefs: [defaultType, comment.typeDef, tournament.typeDef, user.typeDef, tournamentResult.typeDef],
  resolvers: [comment.resolers, tournament.resolers, user.resolers, tournamentResult.resolers],
});

export default schema;
