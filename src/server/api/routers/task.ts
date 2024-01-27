import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, memberProcedure } from "~/server/api/trpc";
import { type Task, task } from "~/server/db/schema";

export const taskRouter = createTRPCRouter({
  viewCurrentTask: memberProcedure
    .input(
      z.object({
        groupId: z.number().int(),
      }),
    )
    .query(async ({ ctx, input: { groupId } }) => {
      const tasks = await ctx.db
        .select()
        .from(task)
        .where(eq(task.groupId, groupId));

      return tasks.filter((task: Task) => {
        const now = new Date();
        const startTime = new Date(task.startTime);
        const endTime = new Date(startTime.getTime() + task.duration * 60000);
        return startTime <= now && endTime >= now;
      });
    }),

  //view task
});
