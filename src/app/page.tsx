import { Plus } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { Login, getUserId } from "~/components/auth";
import { PageWrapper } from "~/components/page-wrapper";
import { PictureGrid } from "~/components/picture-grid";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();

  const userId = (await getUserId()) ?? "";

  const images = await api.picture.getForUser.query({ userId });

  const groups = await api.group.getForUser.query({ userId });

  return (
    <PageWrapper className="grid h-[90dvh] w-full max-w-7xl place-items-center">
      {userId ? (
        <>
          <div className="flex items-center gap-10">
            <Button asChild>
              <Link href="/group/new" className="flex gap-2">
                <Plus className="h-4 w-4" />
                Create a new Group
              </Link>
            </Button>
            {groups.length ? (
              <div className="flex flex-col gap-3">
                <h1 className="mb-4 text-4xl underline decoration-violet-400 underline-offset-2">
                  Your Groups
                </h1>
                <div className="flex gap-3">
                  {groups.map((group, i) => (
                    <Button variant="outline" key={i}>
                      <Link href={`/group/${group.id}`}>
                        {group.displayName}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h1 className="mb-14 text-4xl underline decoration-violet-400 underline-offset-2">
                  You dont have any groups!
                </h1>
              </>
            )}
          </div>
          <div>
            {images.length ? (
              <>
                <h1 className="mb-14 text-4xl underline decoration-violet-400 underline-offset-2">
                  Your Photos
                </h1>
                <PictureGrid data={images} />
              </>
            ) : (
              <div>You don&apos;t have any pictures yet</div>
            )}
          </div>
        </>
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
