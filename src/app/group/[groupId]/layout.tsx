import { type ReactNode } from "react";
import { z } from "zod";
import { getUserId } from "~/components/auth";
import { PageWrapper } from "~/components/page-wrapper";
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
  const userId = await getUserId();

  // TODO make this not shit
  if (!userId) return;

  const gid = z.coerce.number().int().parse(groupId);

  const isMember = await api.group.isMember.query({
    groupId: gid,
    userId,
  });

  if (!isMember) return <div>not a member</div>;

  const isOrganiser = await api.group.isAdmin.query({
    groupId: gid,
    organiserId: userId,
  });

  return <PageWrapper>{isOrganiser ? organiser : member}</PageWrapper>;
}
