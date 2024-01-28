import Image from "next/image";
import { api } from "~/trpc/server";

export async function PictureGrid({ groupId }: { groupId: number }) {
  const arr = await api.picture.getForGroup.query({ groupId });

  return (
    <div className="grid grid-cols-4 gap-4">
      {arr.map((_, i) => (
        <Image key={i} width={200} height={200} src="/test.png" alt="" />
      ))}
    </div>
  );
}
