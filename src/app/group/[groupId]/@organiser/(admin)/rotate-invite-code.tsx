"use client";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
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
  const router = useRouter();
  const { isLoading, mutateAsync: rotateAsync } =
    api.group.admin.regenerateCode.useMutation();

  return (
    <div className="flex gap-4">
      <Card className="px-4 py-2 font-mono text-lg">{inviteCode}</Card>
      <Button
        className="flex gap-2"
        size="lg"
        onClick={() =>
          void toast.promise(
            rotateAsync({ groupId, organiserId }).then(() => router.refresh()),
            {
              success: "Invite code changed",
              loading: "Loading...",
              error: "error",
            },
          )
        }
      >
        <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        rotate
      </Button>
    </div>
  );
}
