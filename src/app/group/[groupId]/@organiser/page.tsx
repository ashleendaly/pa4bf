import { z } from "zod";

import { getUserId } from "~/components/auth";
import { PageWrapper } from "~/components/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import { AdminTab } from "./(admin)/admin-tab";
import { MembersTab } from "./(members)/members-tab";
import { TasksTab } from "./(tasks)/tasks-tab";
import { PictureGrid } from "~/components/picture-grid";
import { QrCode } from "../qr-code";

export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const gid = z.coerce.number().int().parse(groupId);

  const userId = await getUserId();
  if (!userId) return;

  const groupData = await api.group.details.query({ groupId: gid, userId });

  if (!groupData[0]) return <div>group does not exist</div>;

  const { displayName, inviteCode } = groupData[0];

  const membersData = await api.group.admin.getAllUsers.query({ groupId: gid });

  const taskData = await api.task.viewAllTasks.query({ groupId: gid });

  const pictures = await api.picture.getForGroup.query({ groupId: gid });

  return (
    <PageWrapper className="pt-16">
      <div className="flex w-full items-end justify-between">
        <h1 className="mb-6 ml-3 text-5xl">{displayName}</h1>
        <QrCode code={inviteCode} />
      </div>
      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="admin">
            Admin
          </TabsTrigger>
          <TabsTrigger className="w-full" value="members">
            Members
          </TabsTrigger>
          <TabsTrigger className="w-full" value="tasks">
            Tasks
          </TabsTrigger>
          <TabsTrigger className="w-full" value="pictures">
            Pictures
          </TabsTrigger>
        </TabsList>
        <TabsContent value="admin">
          <AdminTab
            groupId={gid}
            displayName={displayName}
            inviteCode={inviteCode}
          />
        </TabsContent>
        <TabsContent value="members">
          <MembersTab membersData={membersData} />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksTab taskData={taskData} groupId={gid} />
        </TabsContent>
        <TabsContent value="pictures">
          <div className="mt-16">
            <PictureGrid data={pictures} />
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}
