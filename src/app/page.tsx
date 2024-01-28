import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";

import { getUserId } from "~/components/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();

  const userId = (await getUserId()) ?? "";

  const images = await api.picture.getForUser.query({ userId });

  return (
    <section>
      <div>
        {images.length ? (
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
        ) : (
          <div>You don&apos;t have any pictures yet</div>
        )}
      </div>
    </section>
  );
}
