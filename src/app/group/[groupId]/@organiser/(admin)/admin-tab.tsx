import { Separator } from "~/components/ui/separator";
import { DeleteGroupButton } from "./delete-group-button";
import { GroupNameForm } from "./group-name-form";
import { RotateInviteCode } from "./rotate-invite-code";
import { getUserId } from "~/components/auth";

export async function AdminTab({
  groupId,
  displayName,
  inviteCode,
}: {
  groupId: number;
  displayName: string;
  inviteCode: string;
}) {
  const organiserId = (await getUserId())!;

  return (
    <div className="mt-10">
      <GroupNameForm
        groupId={groupId}
        organiserId={organiserId}
        currentDisplayName={displayName}
      />
      <Separator className="my-12" />
      <RotateInviteCode
        groupId={groupId}
        organiserId={organiserId}
        inviteCode={inviteCode}
      />
      <Separator className="my-12" />
      <DeleteGroupButton groupId={groupId} organiserId={organiserId} />
    </div>
  );
}

//delete group
//rename group
//remake group code
//make member owner of group
//remove ownership of member from group
