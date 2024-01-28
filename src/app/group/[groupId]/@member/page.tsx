import { z } from "zod";

import { PageWrapper } from "~/components/page-wrapper";
import { api } from "~/trpc/server";
import { getUserId } from "~/components/auth";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { PictureGrid } from "~/components/picture-grid";

export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const userId = await getUserId();
  if (!userId) return;
  const gid = z.coerce.number().int().parse(groupId);

  const images = await api.picture.getForGroup.query({ groupId: gid });

  const currentTask = await api.task.viewCurrentTask.query({
    groupId: gid,
    userId,
  });

  return (
    <PageWrapper className="grid h-[90dvh] place-items-center">
      <div className="flex flex-col gap-5">
        {currentTask && (
          <Link href={`/group/${groupId}/task`} className="w-full ">
            <Button size="lg" className="w-full">
              Go to live task
            </Button>
          </Link>
        )}
        <h1 className="mb-4 mt-6 text-3xl underline decoration-violet-400 underline-offset-2">
          All Group pictures
        </h1>
        {images.length !== 0 ? (
          <PictureGrid data={images} />
        ) : (
          <div>You don&apos;t have any pictures yet</div>
        )}
      </div>
    </PageWrapper>
  );
}
