import { getSession } from "@auth0/nextjs-auth0";
import { z } from "zod";
import { api } from "~/trpc/server";
import { QrCode } from "../qr-code";

export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  const session = await getSession();
  if (!session) return <>not authorized</>;
  const userId = session.user.sid as string;
  const gid = z.coerce.number().int().parse(groupId);

  const [groupData] = await api.group.details.query({
    userId,
    groupId: gid,
  });

  if (!groupData) return <div>group does not exist</div>;

  const { displayName, inviteCode } = groupData;

  return (
    <div>
      <div>
        groupId - [{displayName}, {inviteCode}]
      </div>
      <QrCode code={inviteCode} />
      {userId}
    </div>
  );
}
