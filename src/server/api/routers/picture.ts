import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { type GridPicture } from "~/components/picture-grid";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  groupOwnership,
  groupPicture,
  picture,
  taskPicture,
  userPicture,
} from "~/server/db/schema";

const defaultPics = Array.from(Array(10)).fill({
  url: "/test.png",
  id: 1,
  caption: "caption",
}) as GridPicture[];

export const pictureRouter = createTRPCRouter({
  upload: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        groupId: z.number().int(),
        url: z.string().url(),
        taskId: z.number().int(),
      }),
    )
    .mutation(async ({ ctx, input: { userId, groupId, taskId, url } }) => {
      console.log(url, taskId);
      const res = await fetch(`http://${env.HOSTNAME}/apy/upload`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ image_url: url, group_id: groupId }),
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const bs = await res.json();
      const result = z.string().safeParse(bs);
      if (!result.success) return;
      const hash = result.data;
      const [newPicture] = await ctx.db
        .insert(picture)
        .values({ redis_hash: hash, url })
        .returning();

      const pictureId = newPicture!.id;

      await ctx.db.insert(userPicture).values({ userId, pictureId });
      await ctx.db.insert(groupPicture).values({ groupId, pictureId });
      await ctx.db.insert(taskPicture).values({ taskId, pictureId });
      return pictureId;
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
      const res = await ctx.db
        .select({
          url: picture.url,
          caption: picture.caption,
          id: picture.id,
        })
        .from(userPicture)
        .where(eq(userPicture.userId, userId))
        .innerJoin(picture, eq(picture.id, userPicture.pictureId));

      if (!res.length) return defaultPics;
      return res as GridPicture[];
    }),

  getForGroup: publicProcedure
    .input(
      z.object({
        groupId: z.number().int(),
      }),
    )
    .query(async ({ ctx, input: { groupId } }) => {
      const res = await ctx.db
        .select({
          url: picture.url,
          caption: picture.caption,
          id: picture.id,
        })
        .from(groupPicture)
        .where(eq(groupPicture.groupId, groupId))
        .innerJoin(picture, eq(picture.id, groupPicture.pictureId));

      if (!res.length) return defaultPics;
      return res as GridPicture[];
    }),

  //create picture
  //delete picture
  //update caption
  //view picture
});
