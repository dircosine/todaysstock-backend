import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';

const prisma = new PrismaClient();

export const typeDef = gql`
  type User {
    id: Int!
    email: String!
    name: String
    comments: [Comment]
    tournamentResults: [TournamentResult]
  }

  extend type Mutation {
    createUser(email: String!, name: String): User!
  }
`;

export const resolers: IResolvers = {
  User: {
    comments({ id }) {
      return prisma.comment.findMany({ where: { userId: id } });
    },
    tournamentResults({ id }) {
      return prisma.tournamentResult.findMany({ where: { userId: id } });
    },
  },
  Mutation: {
    createUser(_: any, args) {
      const { email, name } = args;
      return prisma.user.create({ data: { email, name } });
    },
  },
};
