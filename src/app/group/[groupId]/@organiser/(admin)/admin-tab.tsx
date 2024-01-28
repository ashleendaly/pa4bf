import { getUserId } from "~/components/auth";
import { Separator } from "~/components/ui/separator";
import { DeleteGroupButton } from "./delete-group-button";
import { GroupNameForm } from "./group-name-form";
import { NewTaskForm } from "./new-task-form";
import { ResultsButton } from "./results-button";
import { RotateInviteCode } from "./rotate-invite-code";

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
    <div className="mt-10 pb-28">
      <h2 className="mb-3 text-2xl underline decoration-violet-400 underline-offset-4">
        Rename Group
      </h2>
      <GroupNameForm
        organiserId={organiserId}
        currentDisplayName={displayName}
        groupId={groupId}
      />
      <Separator className="my-12" />
      <h2 className="mb-3 text-2xl underline decoration-violet-400 underline-offset-4">
        Change Invite Code
      </h2>
      <RotateInviteCode
        groupId={groupId}
        organiserId={organiserId}
        inviteCode={inviteCode}
      />

      <Separator className="my-12" />
      <h2 className="mb-3 text-2xl underline decoration-violet-400 underline-offset-4">
        Create a new task
      </h2>
      <NewTaskForm groupId={groupId} />
      <Separator className="my-12" />
      <h2 className="mb-3 text-2xl underline decoration-violet-400 underline-offset-4">
        Ask the AI Gods for the winner
      </h2>
      <ResultsButton groupId={groupId} organiserId={organiserId} />
      <Separator className="my-12" />
      <h2 className="mb-3 text-2xl underline decoration-red-400 underline-offset-4">
        Danger Zone
      </h2>
      <DeleteGroupButton groupId={groupId} organiserId={organiserId} />
    </div>
  );
}

//delete group
//rename group
//remake group code
//make member owner of group
//remove ownership of member from group
