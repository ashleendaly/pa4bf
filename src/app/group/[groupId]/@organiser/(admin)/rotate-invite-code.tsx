"use client";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";

export function RotateInviteCode({
  inviteCode,
  groupId,
  organiserId,
}: {
  inviteCode: string;
  groupId: number;
  organiserId: string;
}) {
  const { mutateAsync: rotateAsync } =
    api.group.admin.regenerateCode.useMutation();

  return (
    <div className="flex gap-4">
      <Card className="px-4 py-2 font-mono text-lg">{inviteCode}</Card>
      <Button
        className="flex gap-2"
        size="lg"
        onClick={() =>
          void toast.promise(rotateAsync({ groupId, organiserId }), {
            success: "Invite code changed",
            loading: "Loading...",
            error: "error",
          })
        }
      >
        <RefreshCcw className="h-4 w-4" />
        rotate
      </Button>
    </div>
  );
}
