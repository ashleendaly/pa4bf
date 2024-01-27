import { Spinner } from "~/components/ui/spinner";
import { JoinGroup } from "./join-group";
import { getSession } from "@auth0/nextjs-auth0";
import { z } from "zod";

export default async function JoinClub({
  params: { code },
}: {
  params: { code: string };
}) {
  const session = await getSession();

  if (!session) return <>you must be logged in</>;

  const id = z.string().parse(session.user.sid);

  return (
    <div className="grid h-[80dvh] place-items-center">
      <JoinGroup code={code} userId={id} />
      <Spinner />
    </div>
  );
}
