import { z } from "zod";

import { PageWrapper } from "~/components/page-wrapper";
import { api } from "~/trpc/server";
import { PictureGrid } from "../@organiser/(picture)/picture-grid";
import { getUserId } from "~/components/auth";
import { Button } from "~/components/ui/button";
import Link from "next/link";

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
      {currentTask && (
        <Link href={`/group/${groupId}/task`} className="-mt-32 w-full">
          <Button size="lg" className="w-full">
            Go to live task
          </Button>
        </Link>
      )}
      <div>
        {images.length !== 0 ? (
          <PictureGrid images={images} />
        ) : (
          <div>You don&apos;t have any pictures yet</div>
        )}
      </div>
    </PageWrapper>
  );
}
