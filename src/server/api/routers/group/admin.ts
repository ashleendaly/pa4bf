import { and, eq } from "drizzle-orm";
import { generate as generateRandomWords } from "random-words";
import { z } from "zod";

import { env } from "~/env";
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
  picture,
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

      await new Promise((r) => setTimeout(r, 1000));
    },
  ),

  calculateResults: organiserProcedure.mutation(
    async ({ ctx, input: { groupId } }) => {
      const tasks = await ctx.db
        .select()
        .from(task)
        .where(eq(task.groupId, groupId));

      const results = await Promise.all(
        tasks.map(async (task) => {
          const res = await fetch(`http://${env.HOSTNAME}/apy/search`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
              task_id: task.id,
              group_id: groupId,
              search_query: task.description,
            }),
          })
            .then((e) => e.json())
            .then((e) => z.record(z.string(), z.number()).safeParse(e));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          if (!res.success) return;
          return res.data;
        }),
      );

      return results.map((e) => {
        if (!e) return;
        return Object.entries(e)
          .sort(([_a, a], [_b, b]) => a - b)
          .slice(9);
      });
    },
  ),

  setWinner: organiserProcedure
    .input(
      z.object({
        hash: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { hash } }) => {
      await ctx.db
        .update(picture)
        .set({ winner: true })
        .where(eq(picture.redis_hash, hash));
    }),

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

  invertOwner: organiserProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { organiserId, userId, groupId } }) => {
      if (organiserId === userId) {
        return;
      }
      const isntOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, userId),
            eq(groupOwnership.groupId, groupId),
          ),
        );

      if (isntOwner.length === 0) {
        await ctx.db.insert(groupOwnership).values({ userId, groupId });
      } else {
        await ctx.db
          .delete(groupOwnership)
          .where(
            and(
              eq(groupOwnership.userId, userId),
              eq(groupOwnership.groupId, groupId),
            ),
          );
      }
    }),

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

  getAllUsers: publicProcedure
    .input(
      z.object({
        groupId: z.number().int(),
      }),
    )
    .query(async ({ ctx, input: { groupId } }) => {
      return await ctx.db
        .select()
        .from(groupMembership)
        .where(eq(groupMembership.groupId, groupId));
    }),

  //create group
  //delete group
  //rename group
  //remake group code
  //kick member from group
  //make member owner of group
  //remove ownership of member from group
  //invert ownership of user
  //create task
  //start/stop task
  //delete task
  // get all users
});
