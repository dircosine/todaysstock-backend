import { PrismaClient, Tournament } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';
import { formatEventDate } from '../lib/utils';

const prisma = new PrismaClient();

export const typeDef = gql`
  type Tournament {
    id: Int
    eventDate: String
    stockInfo: String
  }

  extend type Query {
    todaysInfo: Tournament
    stockInfo(eventDate: String!): Tournament
  }
  extend type Mutation {
    createTournament(eventDate: String!): Boolean!
    postTournamentResult(
      tournamentId: Int!
      rank: [String!]!
      market: String!
    ): Boolean!
  }
`;

const getTargetEventDate = (now: Date): string => {
  if (now.getUTCHours() < 10) {
    now.setDate(now.getDate() - 1);
  }
  return formatEventDate(now);
};

const scoreMap: number[] = [10, 8, 5, 5, 2, 2, 2, 2];
const updateStat = async (
  tournamentId: number,
  rank: string[],
  marketString: string,
) => {
  const tournament: Tournament | null = await prisma.tournament.findOne({
    where: { id: tournamentId },
  });
  if (!tournament) {
    return;
  }
  // *** scores
  const scores = JSON.parse(tournament.scores);
  rank.slice(0, 8).map((item: string, rank: number) => {
    scores[item] = scores[item] + scoreMap[rank];
  });

  // *** marketStat
  const marketStat = JSON.parse(tournament.marketStat);
  const market = JSON.parse(marketString);
  Object.keys(market).map((key) => {
    console.log(key);
    marketStat[key][market[key]] = marketStat[key][market[key]] + 1;
  });

  // db update
  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { scores, marketStat, turnCount: tournament?.turnCount || 0 + 1 },
  });
};

export const resolers: IResolvers = {
  Query: {
    todaysInfo(_: any) {
      const eventDate = getTargetEventDate(new Date());
      return prisma.tournament.findOne({
        where: { eventDate },
      });
    },
    async stockInfo(_: any, args) {
      const { eventDate } = args;
      return prisma.tournament.findOne({
        where: { eventDate },
      });
    },
  },
  Mutation: {
    async postTournamentResult(_: any, args) {
      const { tournamentId, rank, market: marketString } = args;

      console.log(rank);
      // *** tournamentResult row 생성
      await prisma.tournamentResult.create({
        data: {
          tournament: { connect: { id: tournamentId } },
          rank: { set: rank },
          market: marketString,
        },
      });

      // *** 결과를 통계에 반영
      updateStat(tournamentId, rank, marketString);

      return true;
    },
  },
};
