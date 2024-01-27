import { z } from "zod";
import { getUserId } from "~/components/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/server";
import { AdminTab } from "./admin-tab";

export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const gid = z.coerce.number().int().parse(groupId);

  const userId = await getUserId();
  if (!userId) return;

  const [groupData] = await api.group.details.query({
    userId,
    groupId: gid,
  });

  if (!groupData) return <div>group does not exist</div>;

  const { displayName, inviteCode } = groupData;

  return (
    <div>
      <h1>{displayName}</h1>
      <Tabs defaultValue="admin" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="pictures">Pictures</TabsTrigger>
        </TabsList>
        <TabsContent value="admin">
          <AdminTab inviteCode={inviteCode} />
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
    </div>
  );
}

function MembersTab() {
  return <>members</>;
}
function TasksTab() {
  return <>tasks</>;
}
function PicturesTab() {
  return <>pics</>;
}
