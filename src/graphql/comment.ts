import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';

const prisma = new PrismaClient();

export const typeDef = gql`
  input CreateTagInput {
    name: String!
  }

  input CreateCommentInput {
    author: String
    message: String!
    tournamentId: Int!
    tags: [CreateTagInput]
  }

  type Comment {
    id: Int!
    user: User
    message: String!
    tags: [String]
    createdAt: String!
    tournament: Tournament!
    userId: Int
  }

  extend type Mutation {
    createComment(input: CreateCommentInput): Boolean!
  }
`;

export const resolers: IResolvers = {
  Comment: {
    user({ userId }) {
      return prisma.user.findOne({ where: { id: userId } });
    },
  },
  Mutation: {
    async createComment(_: any, args) {
      const { tournamentId, tags, ...input } = args.input;

      await prisma.comment.create({
        data: {
          tournament: { connect: { id: tournamentId } },
          tags: { create: tags },
          ...input,
        },
      });

      return true;
    },
  },
};
