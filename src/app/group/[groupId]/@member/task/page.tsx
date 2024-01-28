import { getSession } from "@auth0/nextjs-auth0";
import { api } from "~/trpc/server";
import { z } from "zod";
import { UploadButton } from "~/components/upload-button";

export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const session = await getSession();
  if (!session) return <>not authorized</>;
  const userId = session.user.sid as string;

  const gid = z.coerce.number().int().parse(groupId);

  const currentTask = await api.task.viewCurrentTask.query({
    groupId: gid,
    userId,
  });

  if (!currentTask)
    return (
      <div className="grid place-items-center text-2xl">
        Looks like you&apos;re all caught up! 🎉 Take a moment to relax and
        enjoy your free time.
      </div>
    );

  const hasCompletedTask = await api.task.hasCompletedTask.query({
    groupId: gid,
    userId,
    taskId: currentTask.id,
  });

  if (hasCompletedTask)
    return (
      <div className="grid place-items-center text-2xl">
        Looks like you&apos;re all caught up! 🎉 Take a moment to relax and
        enjoy your free time.
      </div>
    );

  return (
    <>
      <div>{currentTask.description}</div>
      <UploadButton />
    </>
  );
}
