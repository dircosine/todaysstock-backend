import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';

const prisma = new PrismaClient();

export const typeDef = gql`
  type User {
    id: Int!
    email: String!
    name: String!
    comments: [Comment]
  }
`;

export const resolers: IResolvers = {};
