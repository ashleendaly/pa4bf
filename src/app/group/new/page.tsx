import { getSession } from "@auth0/nextjs-auth0";

import { PageWrapper } from "~/components/page-wrapper";
import { NewGroupForm } from "./new-group-form";
import { z } from "zod";

export default async function Page() {
  const session = await getSession();
  if (!session) return;

  const userId = z.string().parse(session.user.sid);

  return (
    <PageWrapper className="flex flex-col items-start justify-start gap-10 pt-20">
      <h1 className="text-3xl">Create new group</h1>
      <NewGroupForm userId={userId} />
    </PageWrapper>
  );
}
