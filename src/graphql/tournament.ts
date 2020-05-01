import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';

const prisma = new PrismaClient();

export const typeDef = gql`
  type Tournament {
    id: Int!
    eventDate: String!
    stockInfo: String!
    comments: [Comment]
  }
  extend type Query {
    stockInfo(eventDate: String!): String
  }
  extend type Mutation {
    createTournament(eventDate: String!): Boolean!
  }
`;

export const resolers: IResolvers = {
  Query: {
    async stockInfo(_: any, args) {
      const { eventDate } = args;
      const todaysTournamet = await prisma.tournament.findOne({
        where: { eventDate },
        select: { stockInfo: true },
      });
      return todaysTournamet?.stockInfo;
    },
  },
};
