import { z } from "zod";
import { getUserId } from "~/components/auth";
import { PageWrapper } from "~/components/page-wrapper";
import { Separator } from "~/components/ui/separator";

export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const userId = await getUserId();
  if (!userId) return <>not authorized</>;

  const gid = z.coerce.number().int().parse(groupId);

  return (
    <PageWrapper className="grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-3xl underline decoration-violet-400 underline-offset-2">
          Top 10!
        </h2>

        <Separator className="my-7" />
        {/* pictures */}
      </div>
    </PageWrapper>
  );
}
