import { z } from "zod";
import { getUserId } from "~/components/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import { AdminTab } from "./admin-tab";

import { MembersTab } from "./members-tab";
import { TasksTab } from "./tasks-tab";
import { PageWrapper } from "~/components/page-wrapper";

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

  return (
    <PageWrapper>
      <h1 className="mb-6 ml-3 text-5xl">{displayName}</h1>
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
          <AdminTab displayName={displayName} inviteCode={inviteCode} />
        </TabsContent>
        <TabsContent value="members">
          <MembersTab />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksTab />
        </TabsContent>
        <TabsContent value="pictures">
          <PicturesTab />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

function PicturesTab() {
  return <>pics</>;
}
