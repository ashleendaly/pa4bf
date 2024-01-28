import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { groupMembership, groupOwnership, group } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  join: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        inviteCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, inviteCode } }) => {
      const [groupData] = await ctx.db
        .select()
        .from(group)
        .where(eq(group.inviteCode, inviteCode));

      if (!groupData) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const { id: groupId } = groupData;

      const alreadyIn = await ctx.db
        .select()
        .from(groupMembership)
        .where(
          and(
            eq(groupMembership.userId, userId),
            eq(groupMembership.groupId, groupId),
          ),
        );

      if (alreadyIn.length !== 0) {
        return groupData.id;
      }

      await ctx.db.insert(groupMembership).values({ groupId, userId });
      return groupData.id;
    }),

  leave: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, groupId } }) => {
      const isMember = await ctx.db
        .select()
        .from(groupMembership)
        .where(
          and(
            eq(groupMembership.userId, userId),
            eq(groupMembership.groupId, groupId),
          ),
        );
      const isOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      if (isMember.length !== 0 && isOwner.length === 0) {
        return;
      }
      await ctx.db
        .delete(groupMembership)
        .where(
          and(
            eq(groupMembership.userId, userId),
            eq(groupMembership.groupId, groupId),
          ),
        );
    }),

  access: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.number().int(),
      }),
    )
    .query(async ({ ctx, input: { userId, groupId } }) => {
      const isMember = await ctx.db
        .select()
        .from(groupMembership)
        .where(
          and(
            eq(groupMembership.userId, userId),
            eq(groupMembership.groupId, groupId),
          ),
        );
      if (isMember.length === 0) {
        return false;
      }
      return true;
    }),

  //join group
  //leave group
  //view group
});
