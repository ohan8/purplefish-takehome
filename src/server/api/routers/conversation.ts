import { MessageType } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const conversationRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.create({
        data: {
          title: input.title,
        },
      });
      if (!conversation) {
        throw new Error("Failed to create conversation");
      }

      const message = await ctx.db.message.create({
        data: {
          type: MessageType.USER,
          content: input.title,
          conversationId: conversation.id,
        },
      });
      return conversation;
    }),

  addMessage: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string(),
        type: z.nativeEnum(MessageType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.create({
        data: {
          type: input.type,
          content: input.content,
          conversationId: input.conversationId,
        },
      });
      return message;
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return post ?? null;
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    // get all conversations sorted in descending created at data
    return ctx.db.conversation.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }),

  getMessages: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.conversationId === "") {
        return [];
      }
      return ctx.db.message.findMany({
        where: {
          conversationId: input.conversationId,
        },
        orderBy: { createdAt: "asc" },
      });
    }),
});
