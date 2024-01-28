"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function ResultsButton({
  groupId,
  organiserId,
}: {
  groupId: number;
  organiserId: string;
}) {
  const router = useRouter();
  const { mutateAsync: calcAsync } =
    api.group.admin.calculateResults.useMutation();
  return (
    <Button
      className="mt-2"
      size="lg"
      onClick={() =>
        void toast.promise(
          () =>
            calcAsync({ groupId, organiserId }).then(() => router.refresh()),
          {
            success: "The gods have spoken",
            loading: "loading...",
            error: "Oh oh",
          },
        )
      }
    >
      Calculate Results
    </Button>
  );
}
