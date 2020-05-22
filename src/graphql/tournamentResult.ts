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

  extend type Mutation {
    postTournamentResult(eventDate: String!, rank: [String!]!, market: String!, userId: Int): Int!
  }
`;

export const resolers: IResolvers = {
  Mutation: {
    async postTournamentResult(_: any, args) {
      const { eventDate, rank, userId, market: marketString } = args;

      // *** tournamentResult row 생성
      const tournamnetResult = await prisma.tournamentResult.create({
        data: {
          tournament: { connect: { eventDate } },
          user: userId ? { connect: { id: userId } } : null,
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
