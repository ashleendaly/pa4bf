import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, memberProcedure } from "~/server/api/trpc";
import {
  type Task,
  task,
  userPicture,
  groupPicture,
  taskPicture,
} from "~/server/db/schema";

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

      return tasks.find((task: Task) => {
        const now = new Date();
        const startTime = new Date(task.startTime);
        const endTime = new Date(startTime.getTime() + task.duration * 60000);
        return startTime <= now && endTime >= now;
      });
    }),

  hasCompletedTask: memberProcedure
    .input(
      z.object({
        groupId: z.number().int(),
        taskId: z.number().int(),
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { groupId, userId, taskId } }) => {
      const hasCompleted = await ctx.db
        .select()
        .from(userPicture)
        .where(
          and(
            eq(userPicture.userId, userId),
            eq(groupPicture.groupId, groupId),
            eq(taskPicture.taskId, taskId),
          ),
        );

      if (hasCompleted.length === 0) {
        return false;
      }
      return true;
    }),

  //view task
  //has user uploaded picture for task
});
