import { createTRPCRouter } from "~/server/api/trpc";
import { groupRouter } from "./routers/group";
import { userRouter } from "./routers/user";
import { pictureRouter } from "./routers/picture";
import { taskRouter } from "./routers/task";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  group: groupRouter,
  user: userRouter,
  picture: pictureRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
