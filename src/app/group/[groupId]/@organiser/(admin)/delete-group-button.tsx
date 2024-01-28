"use client";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function DeleteGroupButton({
  groupId,
  organiserId,
}: {
  groupId: number;
  organiserId: string;
}) {
  const router = useRouter();
  const { mutateAsync: deleteAsync } = api.group.admin.delete.useMutation();

  return (
    <Button
      size="lg"
      variant="destructive"
      onClick={() =>
        void toast.promise(
          deleteAsync({ groupId, organiserId }).then(() => router.push(`/`)),
          { success: "Deleted group!", loading: "Loading...", error: "error" },
        )
      }
    >
      Delete Group
    </Button>
  );
}
