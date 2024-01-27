import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { group, groupMembership, groupOwnership } from "~/server/db/schema";

export const groupRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        displayName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, displayName } }) => {
      const [newGroup] = await ctx.db
        .insert(group)
        .values({ displayName })
        .returning();

      const groupId = newGroup!.id;

      await ctx.db.insert(groupMembership).values({ groupId, userId });
      await ctx.db.insert(groupOwnership).values({ groupId, userId });
    }),
});
