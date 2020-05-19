import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';
import { getTargetEventDate, getTournament, updateStat } from './tournament.lib';

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
    getTodaysTournament: Tournament
    getTournament(eventDate: String!): Tournament
  }
  extend type Mutation {
    createTournament(eventDate: String!): Boolean!
    postTournamentResult(eventDate: String!, rank: [String!]!, market: String!, userId: Int): Boolean!
  }
`;

export const resolers: IResolvers = {
  Tournament: {
    comments({ tournamentId }) {
      return prisma.comment.findMany({ where: { tournamentId } });
    },
  },
  Query: {
    getTodaysTournament() {
      const eventDate = getTargetEventDate(new Date());
      return getTournament(eventDate);
    },
    getTournament(_: any, args) {
      const { eventDate } = args;
      return getTournament(eventDate);
    },
  },
  Mutation: {
    async postTournamentResult(_: any, args) {
      const { eventDate, rank, userId, market: marketString } = args;

      // *** tournamentResult row 생성
      await prisma.tournamentResult.create({
        data: {
          tournament: { connect: { eventDate } },
          user: userId ? { connect: { id: userId } } : null,
          rank: { set: rank },
          market: marketString,
        },
      });

      // *** 결과를 통계에 반영
      updateStat(eventDate, rank, marketString);

      return true;
    },
  },
};
