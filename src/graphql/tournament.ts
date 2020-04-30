import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';
import Axios from 'axios';

const prisma = new PrismaClient();

// 추후 express 엔드포인트로
const craeteTournament = async (eventDate: string) => {
  const response = await Axios.get(
    `https://res-todaysstock.s3.ap-northeast-2.amazonaws.com/${eventDate}_stock_infos.json`,
  );
  const stockInfoString = JSON.stringify(response.data);

  const test = await prisma.tournament.create({
    data: { eventDate, stockInfo: stockInfoString },
  });
  console.log(test);
};
// ***

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
  Mutation: {
    // 추후 express 엔드포인트로
    async createTournament(_: any, args) {
      const { eventDate } = args;
      await craeteTournament(eventDate);
      return true;
    },
  },
};
