import { Separator } from "~/components/ui/separator";
import { DeleteGroupButton } from "./delete-group-button";
import { GroupNameForm } from "./group-name-form";
import { RotateInviteCode } from "./rotate-invite-code";
import { NewTaskForm } from "./new-task-form";

export async function AdminTab({
  userId,
  displayName,
  inviteCode,
}: {
  userId: string;
  displayName: string;
  inviteCode: string;
}) {
  return (
    <div className="mt-10">
      <GroupNameForm userId={userId} currentDisplayName={displayName} />
      <Separator className="my-12" />
      <RotateInviteCode inviteCode={inviteCode} />
      <Separator className="my-12" />
      <DeleteGroupButton />
      <Separator />
      <NewTaskForm userId={userId} />
    </div>
  );
}

//delete group
//rename group
//remake group code
//make member owner of group
//remove ownership of member from group
