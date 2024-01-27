"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

export default function JoinClub({
  params: { code },
}: {
  params: { code: string };
}) {
  const router = useRouter();
  // const { mutateAsync: joinClubAsync } = api.club.members.join.useMutation();

  // useEffect(() => {
  //   void joinClubAsync({ joinCode: code })
  //     .then(({ name: clubName }) => router.push(`/club/${clubName}`))
  //     .catch(() => toast.error("Invalid Join Code"));
  // }, [code, joinClubAsync, router]);

  return (
    <div className="grid h-[80dvh] place-items-center">
      <Spinner />
    </div>
  );
}
