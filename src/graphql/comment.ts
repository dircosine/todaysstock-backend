import { PrismaClient } from '@prisma/client';
import { gql, IResolvers } from 'apollo-server-express';

const prisma = new PrismaClient();

export const typeDef = gql`
  input CreateCommentInput {
    eventDate: String!
    userId: Int
    message: String!
    tags: [String]
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
    createComment(input: CreateCommentInput): Comment!
  }
`;

export const resolers: IResolvers = {
  Comment: {
    user({ userId }) {
      return userId ? prisma.user.findOne({ where: { id: userId } }) : null;
    },
  },
  Mutation: {
    createComment(_: any, args) {
      const { eventDate, tags, userId, message } = args.input;
      return prisma.comment.create({
        data: {
          user: userId ? { connect: { id: userId } } : null,
          tags: { set: tags || [] },
          message,
          tournament: { connect: { eventDate } },
        },
      });
    },
  },
};
