import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';
import { formatEventDate } from '../lib/utils';

const prisma = new PrismaClient();

export const typeDef = gql`
  type Tournament {
    id: Int!
    eventDate: String!
    stockInfo: String!
    comments: [Comment]
  }
  extend type Query {
    todaysInfo: String
    stockInfo(eventDate: String!): String
  }
  extend type Mutation {
    createTournament(eventDate: String!): Boolean!
  }
`;

const getTargetEventDate = (now: Date): string => {
  if (now.getUTCHours() < 10) {
    now.setDate(now.getDate() - 1);
  }
  return formatEventDate(now);
};

export const resolers: IResolvers = {
  Query: {
    async todaysInfo(_: any) {
      const eventDate = getTargetEventDate(new Date());
      const todaysTournamet = await prisma.tournament.findOne({
        where: { eventDate },
      });
      return todaysTournamet?.stockInfo;
    },
    async stockInfo(_: any, args) {
      const { eventDate } = args;
      const todaysTournamet = await prisma.tournament.findOne({
        where: { eventDate },
      });
      return todaysTournamet?.stockInfo;
    },
  },
};
