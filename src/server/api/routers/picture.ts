import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  groupOwnership,
  groupPicture,
  picture,
  userPicture,
} from "~/server/db/schema";

export const pictureRouter = createTRPCRouter({
  upload: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.number().int(),
        caption: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, groupId, caption } }) => {
      const [newPicture] = await ctx.db
        .insert(picture)
        .values({ caption })
        .returning();

      const pictureId = newPicture!.id;

      await ctx.db.insert(userPicture).values({ userId, pictureId });
      await ctx.db.insert(groupPicture).values({ groupId, pictureId });
    }),

  delete: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        pictureId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, pictureId } }) => {
      const isOwner = await ctx.db
        .select()
        .from(userPicture)
        .where(
          and(
            eq(userPicture.userId, userId),
            eq(userPicture.pictureId, pictureId),
          ),
        );
      if (isOwner.length === 0) {
        const result = await ctx.db
          .select({ id: groupPicture.groupId })
          .from(groupPicture)
          .where(eq(groupPicture.pictureId, pictureId));
        if (result.length === 0) {
          return;
        }
        const pictureGroupId = result[0]!.id;
        const isGroupOwner = await ctx.db
          .select()
          .from(groupPicture)
          .where(
            and(
              eq(groupOwnership.userId, userId),
              eq(groupOwnership.groupId, pictureGroupId),
            ),
          );
        if (isGroupOwner.length === 0) {
          return;
        }
      }

      await ctx.db.delete(picture).where(eq(picture.id, pictureId));
      await ctx.db
        .delete(groupPicture)
        .where(eq(groupPicture.pictureId, pictureId));
      await ctx.db
        .delete(userPicture)
        .where(eq(userPicture.pictureId, pictureId));
    }),

  update: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        pictureId: z.number().int(),
        newCaption: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, pictureId, newCaption } }) => {
      const isOwner = await ctx.db
        .select()
        .from(userPicture)
        .where(
          and(
            eq(userPicture.userId, userId),
            eq(userPicture.pictureId, pictureId),
          ),
        );
      if (isOwner.length === 0) {
        const result = await ctx.db
          .select({ id: groupPicture.groupId })
          .from(groupPicture)
          .where(eq(groupPicture.pictureId, pictureId));
        if (result.length === 0) {
          return;
        }
        const pictureGroupId = result[0]!.id;
        const isGroupOwner = await ctx.db
          .select()
          .from(groupPicture)
          .where(
            and(
              eq(groupOwnership.userId, userId),
              eq(groupOwnership.groupId, pictureGroupId),
            ),
          );
        if (isGroupOwner.length === 0) {
          return;
        }
      }
      await ctx.db
        .update(picture)
        .set({ caption: newCaption })
        .where(eq(picture.id, pictureId));
    }),

  view: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        pictureId: z.number().int(),
      }),
    )
    .query(async ({ ctx, input: { userId, pictureId } }) => {
      const isOwner = await ctx.db
        .select()
        .from(userPicture)
        .where(
          and(
            eq(userPicture.userId, userId),
            eq(userPicture.pictureId, pictureId),
          ),
        );
      if (isOwner.length === 0) {
        const result = await ctx.db
          .select({ id: groupPicture.groupId })
          .from(groupPicture)
          .where(eq(groupPicture.pictureId, pictureId));
        if (result.length === 0) {
          return false;
        }
        const pictureGroupId = result[0]!.id;
        const isGroupOwner = await ctx.db
          .select()
          .from(groupPicture)
          .where(
            and(
              eq(groupOwnership.userId, userId),
              eq(groupOwnership.groupId, pictureGroupId),
            ),
          );
        if (isGroupOwner.length === 0) {
          return false;
        }
      }
      return true;
    }),

  getForUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { userId } }) => {
      return ((await ctx.db
        .select({
          picture_url: picture.url,
        })
        .from(userPicture)
        .where(eq(userPicture.userId, userId))
        .innerJoin(picture, eq(picture.id, userPicture.pictureId))) ?? []) as {
        picture_url: string;
      }[];
    }),

  //create picture
  //delete picture
  //update caption
  //view picture
});
