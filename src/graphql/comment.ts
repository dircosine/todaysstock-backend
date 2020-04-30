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
    author: String
    message: String!
    createdAt: String!
    tournamentId: Int!
    tournament: Tournament!
    tags: [Tag]
  }

  extend type Query {
    comments(tournamentId: Int): [Comment]
  }

  extend type Mutation {
    createComment(input: CreateCommentInput): Boolean!
  }
`;

export const resolers: IResolvers = {
  Comment: {
    tags({ id }) {
      return prisma.tag.findMany({ where: { commentId: id } });
    },
  },
  Query: {
    comments(_: any, args) {
      const { tournamentId } = args;

      return prisma.comment.findMany({ where: { tournamentId } });
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
