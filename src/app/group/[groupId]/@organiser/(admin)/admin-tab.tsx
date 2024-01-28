import { Separator } from "~/components/ui/separator";
import { DeleteGroupButton } from "../(admin)/delete-group-buttonn";
import { GroupNameForm } from "../(admin)/group-name-formm";
import { RotateInviteCode } from "../(admin)/rotate-invite-codee";

export async function AdminTab({
  displayName,
  inviteCode,
}: {
  displayName: string;
  inviteCode: string;
}) {
  return (
    <div className="mt-10">
      <GroupNameForm userId={""} currentDisplayName={displayName} />
      <Separator className="my-12" />
      <RotateInviteCode inviteCode={inviteCode} />
      <Separator className="my-12" />
      <DeleteGroupButton />
    </div>
  );
}

//delete group
//rename group
//remake group code
//make member owner of group
//remove ownership of member from group
