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

  extend type Query {
    getUser(email: String!): User
  }

  extend type Mutation {
    createUser(email: String!, name: String, resultIds: [Int]): User!
    updateUser(email: String!, newEmail: String, name: String): User!
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
  Query: {
    getUser(_: any, { email }) {
      return prisma.user.findOne({ where: { email } });
    },
  },
  Mutation: {
    createUser(_: any, args) {
      const { email, name, resultIds } = args;
      const connectInstArray = resultIds.map((resultId: number) => ({ id: resultId }));
      return prisma.user.create({
        data: { email, name, tournamentResults: resultIds ? { connect: connectInstArray } : null },
      });
    },
    updateUser(_: any, { email, newEmail, name }) {
      return prisma.user.update({ where: { email }, data: { email: newEmail, name } });
    },
  },
};
