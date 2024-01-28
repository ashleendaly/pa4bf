import { z } from "zod";
import Image from "next/image";

import { PageWrapper } from "~/components/page-wrapper";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const gid = z.coerce.number().int().parse(groupId);

  const images = await api.picture.getForGroup.query({ groupId: gid });

  return (
    <PageWrapper className="grid h-[90dvh] place-items-center">
      <Link href={"./tasks"}>Tasks</Link>
      <div>
        {!!images.length && (
          <>
            <div>Your Photos</div>
            {images.map((e, i) => (
              <Image
                key={i}
                src={e.picture_url}
                width={100}
                height={100}
                alt=""
              />
            ))}
          </>
        )}
        {!images.length && <div>You don&apos;t have any pictures yet</div>}
      </div>
    </PageWrapper>
  );
}
