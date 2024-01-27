import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { generate } from "random-words";

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
      const inviteCode = generate({
        exactly: 1,
        wordsPerString: 3,
        minLength: 4,
        maxLength: 4,
        separator: "-",
      }).at(0)!;

      const [newGroup] = await ctx.db
        .insert(group)
        .values({ inviteCode, displayName })
        .returning();

      const groupId = newGroup!.id;

      await ctx.db.insert(groupMembership).values({ groupId, userId });
      await ctx.db.insert(groupOwnership).values({ groupId, userId });

      return groupId;
    }),

  delete: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, groupId } }) => {
      const isOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      if (isOwner.length === 0) {
        return;
      }
      await ctx.db
        .delete(groupOwnership)
        .where(eq(groupOwnership.groupId, groupId));
      await ctx.db.delete(group).where(eq(group.id, groupId));
      await ctx.db
        .delete(groupMembership)
        .where(eq(groupMembership.groupId, groupId));
      //TODO: add to delete any pictures owned
    }),

  rename: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.number().int(),
        newName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, groupId, newName } }) => {
      const isOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      if (isOwner.length === 0) {
        return;
      }
      await ctx.db
        .update(group)
        .set({ displayName: newName })
        .where(eq(group.id, groupId));
    }),

  redoCode: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.number().int(),
        newCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, groupId, newCode } }) => {
      const isOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      if (isOwner.length === 0) {
        return;
      }
      await ctx.db
        .update(group)
        .set({ inviteCode: newCode })
        .where(eq(group.id, groupId));
    }),

  kick: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        toBeKickedId: z.string(),
        groupId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, toBeKickedId, groupId } }) => {
      const isOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      if (isOwner.length === 0) {
        return;
      }
      await ctx.db
        .delete(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, toBeKickedId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      await ctx.db
        .delete(groupMembership)
        .where(
          and(
            eq(groupMembership.userId, toBeKickedId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
    }),

  makeOwner: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        toBeOwnerId: z.string(),
        groupId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, toBeOwnerId, groupId } }) => {
      if (userId === toBeOwnerId) {
        return;
      }
      const isOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      if (isOwner.length === 0) {
        return;
      }
      const isntOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, toBeOwnerId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      if (isntOwner.length !== 0) {
        return;
      }
      await ctx.db
        .insert(groupOwnership)
        .values({ userId: toBeOwnerId, groupId: groupId });
    }),

  removeOwner: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        tonotBeOwnerId: z.string(),
        groupId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, tonotBeOwnerId, groupId } }) => {
      if (userId === tonotBeOwnerId) {
        return;
      }
      const isOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      if (isOwner.length === 0) {
        return;
      }
      const isntOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, tonotBeOwnerId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
      if (isntOwner.length !== 0) {
        return;
      }
      await ctx.db
        .delete(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, tonotBeOwnerId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
    }),

  //create group
  //delete group
  //rename group
  //remake group code
  //kick member from group
  //make member owner of group
  //remove ownership of member from group
});
