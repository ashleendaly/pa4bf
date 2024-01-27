import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, memberProcedure } from "~/server/api/trpc";
import { task } from "~/server/db/schema";

export const taskRouter = createTRPCRouter({
  viewCurrentTask: memberProcedure
    .input(
      z.object({
        groupId: z.number().int(),
      }),
    )
    .query(async ({ ctx, input: { groupId } }) => {
      await ctx.db.select().from(task).where(eq(task.groupId, groupId));
    }),

  //view task
});
