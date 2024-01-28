import { and, eq } from "drizzle-orm";
import { generate as generateRandomWords } from "random-words";
import { z } from "zod";

import {
  createTRPCRouter,
  memberProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  group,
  groupMembership,
  groupOwnership,
  groupPicture,
  picture,
} from "~/server/db/schema";
import { groupAdminRouter } from "./admin";
import { type GridPicture } from "~/components/picture-grid";

export const groupRouter = createTRPCRouter({
  admin: groupAdminRouter,

  // TODO: should be organiser procedure (can't get it to work)
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        displayName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { displayName, userId } }) => {
      const inviteCode = generateRandomWords({
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

      console.log("-------->", groupId);
      return groupId;
    }),

  details: memberProcedure
    .input(z.object({ groupId: z.number().int(), userId: z.string() }))
    .query(async ({ ctx, input: { groupId } }) => {
      return await ctx.db.select().from(group).where(eq(group.id, groupId));
    }),

  isAdmin: publicProcedure
    .input(z.object({ organiserId: z.string(), groupId: z.number().int() }))
    .query(async ({ ctx, input: { groupId, organiserId } }) => {
      const isOwner = await ctx.db
        .select()
        .from(groupOwnership)
        .where(
          and(
            eq(groupOwnership.userId, organiserId),
            eq(groupOwnership.groupId, groupId),
          ),
        );

      if (isOwner.length === 0) {
        return false;
      }

      return true;
    }),

  isMember: memberProcedure
    .input(z.object({ userId: z.string(), groupId: z.number().int() }))
    .query(async ({ ctx, input: { groupId, userId } }) => {
      const isOwner = await ctx.db
        .select()
        .from(groupMembership)
        .where(
          and(
            eq(groupMembership.userId, userId),
            eq(groupMembership.groupId, groupId),
          ),
        );

      return isOwner.length !== 0;
    }),

  getWinnersForGroup: memberProcedure
    .input(z.object({ groupId: z.number().int() }))
    .query(async ({ ctx, input: { groupId } }) => {
      const res = await ctx.db
        .select({
          url: picture.url,
          caption: picture.caption,
          id: picture.id,
        })
        .from(picture)
        .innerJoin(groupPicture, eq(groupPicture.pictureId, picture.id))
        .where(
          and(eq(groupPicture.groupId, groupId), eq(picture.winner, true)),
        );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return res as GridPicture[];
    }),
});
