import { and, eq } from "drizzle-orm";
import { generate as generateRandomWords } from "random-words";
import { z } from "zod";

import {
  createTRPCRouter,
  organiserProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  group,
  groupMembership,
  groupOwnership,
  groupPicture,
  task,
} from "~/server/db/schema";

export const groupAdminRouter = createTRPCRouter({
  delete: organiserProcedure.mutation(async ({ ctx, input: { groupId } }) => {
    await ctx.db
      .delete(groupOwnership)
      .where(eq(groupOwnership.groupId, groupId));

    await ctx.db
      .delete(groupMembership)
      .where(eq(groupMembership.groupId, groupId));

    await ctx.db.delete(groupPicture).where(eq(groupPicture.groupId, groupId));

    await ctx.db.delete(group).where(eq(group.id, groupId));
  }),

  update: organiserProcedure
    .input(
      z.object({
        newName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { groupId, newName } }) => {
      await ctx.db
        .update(group)
        .set({ displayName: newName })
        .where(eq(group.id, groupId));
    }),

  regenerateCode: organiserProcedure.mutation(
    async ({ ctx, input: { groupId } }) => {
      const newCode = generateRandomWords({
        exactly: 1,
        wordsPerString: 3,
        minLength: 4,
        maxLength: 4,
        separator: "-",
      }).at(0)!;

      await ctx.db
        .update(group)
        .set({ inviteCode: newCode })
        .where(eq(group.id, groupId));
    },
  ),

  kick: organiserProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, groupId } }) => {
      await ctx.db
        .delete(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );

      await ctx.db
        .delete(groupMembership)
        .where(
          and(
            eq(groupMembership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );
    }),

  makeOwner: organiserProcedure
    .input(
      z.object({
        newOrganiserId: z.string(),
      }),
    )
    .mutation(
      async ({ ctx, input: { organiserId, newOrganiserId, groupId } }) => {
        if (organiserId === newOrganiserId) return;

        const isntOwner = await ctx.db
          .select()
          .from(groupOwnership)
          .where(
            and(
              eq(groupOwnership.userId, newOrganiserId),
              eq(groupOwnership.groupId, groupId),
            ),
          );

        if (isntOwner.length !== 0) return;

        await ctx.db
          .insert(groupOwnership)
          .values({ userId: newOrganiserId, groupId: groupId });
      },
    ),

  removeOwner: organiserProcedure
    .input(
      z.object({
        toNotBeOwnerId: z.string(),
      }),
    )
    .mutation(
      async ({ ctx, input: { organiserId, toNotBeOwnerId, groupId } }) => {
        if (organiserId === toNotBeOwnerId) return;

        const isntOwner = await ctx.db
          .select()
          .from(groupOwnership)
          .where(
            and(
              eq(groupOwnership.userId, toNotBeOwnerId),
              eq(groupOwnership.groupId, groupId),
            ),
          );

        if (isntOwner.length !== 0) return;

        await ctx.db
          .delete(groupOwnership)
          .where(
            and(
              eq(groupOwnership.userId, toNotBeOwnerId),
              eq(groupOwnership.groupId, groupId),
            ),
          );
      },
    ),

  makeTask: publicProcedure
    .input(
      z.object({
        groupId: z.number().int(),
        onOff: z.boolean().default(false),
        description: z.string(),
        points: z.number().int(),
        aiJudge: z.boolean().default(true),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { groupId, onOff, description, points, aiJudge },
      }) => {
        return await ctx.db.insert(task).values({
          onOff: onOff,
          groupId: groupId,
          description: description,
          points: points,
          aiJudge: aiJudge,
        });
      },
    ),

  startStopTask: publicProcedure
    .input(
      z.object({
        onOff: z.boolean(),
        groupId: z.number().int(),
        taskId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input: { onOff, groupId, taskId } }) => {
      await ctx.db
        .update(task)
        .set({ onOff: onOff })
        .where(and(eq(task.id, taskId), eq(task.groupId, groupId)));
    }),

  deleteTask: publicProcedure
    .input(
      z.object({
        groupId: z.number().int(),
        taskId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input: { groupId, taskId } }) => {
      await ctx.db
        .delete(task)
        .where(and(eq(task.id, taskId), eq(task.groupId, groupId)));
    }),

  //create group
  //delete group
  //rename group
  //remake group code
  //kick member from group
  //make member owner of group
  //remove ownership of member from group
  //create task
});
