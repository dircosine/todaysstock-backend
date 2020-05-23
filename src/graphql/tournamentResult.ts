import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';
import { updateStat } from './tournament.lib';

const prisma = new PrismaClient();

export const typeDef = gql`
  type TournamentResult {
    id: Int!
    market: String!
    rank: [String]
    tournamentId: Int!
    userId: Int
    tournament: Tournament
    user: User
  }
  extend type Query {
    getTournamentResults(userEmail: String!): [TournamentResult]
  }
  extend type Mutation {
    postTournamentResult(eventDate: String!, rank: [String!]!, market: String!, userEmail: String): Int!
  }
`;

export const resolers: IResolvers = {
  TournamentResult: {
    tournament({ tournamentId }) {
      return prisma.tournament.findOne({ where: { id: tournamentId } });
    },
  },
  Query: {
    getTournamentResults(_: any, { userEmail }) {
      return prisma.tournamentResult.findMany({ where: { user: { email: userEmail } }, orderBy: { id: 'desc' } });
    },
  },
  Mutation: {
    async postTournamentResult(_: any, args) {
      const { eventDate, rank, market: marketString, userEmail } = args;

      // *** tournamentResult row 생성
      const tournamnetResult = await prisma.tournamentResult.create({
        data: {
          tournament: { connect: { eventDate } },
          user: userEmail ? { connect: { email: userEmail } } : null,
          rank: { set: rank },
          market: marketString,
        },
      });

      // *** 결과를 통계에 반영
      updateStat(eventDate, rank, marketString);

      return tournamnetResult.id;
    },
  },
};
