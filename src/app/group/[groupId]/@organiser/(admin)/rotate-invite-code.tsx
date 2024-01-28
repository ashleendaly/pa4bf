import { RefreshCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export function RotateInviteCode({ inviteCode }: { inviteCode: string }) {
  // TODO: hook up procedure
  return (
    <div className="flex gap-4">
      <Card className="px-4 py-2 font-mono text-lg">{inviteCode}</Card>
      <Button className="flex gap-2" size="lg">
        <RefreshCcw className="h-4 w-4" />
        rotate
      </Button>
    </div>
  );
}
