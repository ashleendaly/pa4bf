import { getSession } from "@auth0/nextjs-auth0";
import { type ReactNode } from "react";
import { z } from "zod";
import { api } from "~/trpc/server";

interface pageProps {
  children: ReactNode;
  organiser: ReactNode;
  member: ReactNode;
  params: { groupId: string };
}

export default async function Layout({
  organiser,
  member,
  params: { groupId },
}: pageProps) {
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

  const isMember = await api.group.isMember.query({
    groupId: gid,
    userId,
  });

  if (!isMember) return <div>not a member</div>;

  const isOrganiser = await api.group.isAdmin.query({
    groupId: gid,
    organiserId: userId,
  });

  return (
    <div>
      <div>
        groupId - [{displayName}, {inviteCode}]
      </div>
      {isOrganiser ? organiser : member}
    </div>
  );
}
