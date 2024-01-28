import { z } from "zod";
import { getUserId } from "~/components/auth";
import { PageWrapper } from "~/components/page-wrapper";
import { Separator } from "~/components/ui/separator";
import { UploadButton } from "~/components/upload-button";
import { api } from "~/trpc/server";

export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const userId = await getUserId();
  if (!userId) return <>not authorized</>;

  const gid = z.coerce.number().int().parse(groupId);

  const currentTask = await api.task.viewCurrentTask.query({
    groupId: gid,
    userId,
  });

  if (!currentTask) return <CaughtUp />;

  const hasCompletedTask = await api.task.hasCompletedTask.query({
    groupId: gid,
    userId,
    taskId: currentTask.id,
  });

  if (hasCompletedTask) return <CaughtUp />;

  return (
    <PageWrapper className="grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-3xl underline decoration-violet-400 underline-offset-2">
          Your current task!
        </h2>
        <div className="text-lg">{currentTask.description}</div>
        <Separator className="my-7" />
        <UploadButton groupId={gid} taskId={currentTask.id} userId={userId} />
      </div>
    </PageWrapper>
  );
}

function CaughtUp() {
  return (
    <PageWrapper className="grid place-items-center text-2xl">
      Looks like you&apos;re all caught up! 🎉 Take a moment to relax and enjoy
      your free time.
    </PageWrapper>
  );
}
