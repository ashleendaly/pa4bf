import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";

import { Login, getUserId } from "~/components/auth";
import { PageWrapper } from "~/components/page-wrapper";
import { PictureGrid } from "~/components/picture-grid";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();

  const userId = (await getUserId()) ?? "";

  const images = Array.from(Array(10)).fill({
    url: "/test.png",
    id: 1,
    caption: "caption",
  }); //await api.picture.getForUser.query({ userId });

  return (
    <PageWrapper className="grid h-[90dvh] place-items-center">
      {userId ? (
        <div>
          {!!images.length && (
            <>
              <div>Your Photos</div>
              <PictureGrid data={images} />
            </>
          )}
          {!images.length && <div>You don&apos;t have any pictures yet</div>}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl">Welcome!</h1>
          <Separator />
          <h3 className="flex items-center gap-2">
            <Login /> to view your pictures
          </h3>
        </div>
      )}
    </PageWrapper>
  );
}
