import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';
import { getTournament } from './tournament.lib';
import { formatEventDate } from '../lib/utils';

const prisma = new PrismaClient();

export const typeDef = gql`
  type Tournament {
    id: Int!
    eventDate: String!
    stockInfo: String!
    marketStat: String
    scores: String
    comments: [Comment]
  }

  extend type Query {
    getEventDate: String!
    getTodaysTournament: Tournament
    getTournament(eventDate: String!): Tournament
  }
  extend type Mutation {
    createTournament(eventDate: String!): Boolean!
  }
`;

export const resolers: IResolvers = {
  Tournament: {
    comments({ tournamentId }) {
      return prisma.comment.findMany({ where: { tournamentId } });
    },
  },
  Query: {
    getEventDate() {
      return formatEventDate(new Date());
    },
    getTodaysTournament() {
      const eventDate = formatEventDate(new Date());
      return getTournament(eventDate);
    },
    getTournament(_: any, args) {
      const { eventDate } = args;
      return getTournament(eventDate);
    },
  },
};
