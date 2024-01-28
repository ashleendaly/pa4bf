"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export function JoinGroup({ code, userId }: { code: string; userId: string }) {
  const router = useRouter();
  const { mutateAsync: joinGroupAsync } = api.user.join.useMutation();

  useEffect(() => {
    void joinGroupAsync({ inviteCode: code, userId })
      .then((groupId) => router.push(`/group/${groupId}`))
      .catch(() => toast.error("Invalid Join Code"));
  }, [code, joinGroupAsync, router, userId]);

  return <></>;
}
