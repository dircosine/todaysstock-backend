import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';

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
`;

export const resolers: IResolvers = {};
