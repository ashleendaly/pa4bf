import { PageWrapper } from "~/components/page-wrapper";
import { NewGroupForm } from "./new-group-form";

export default async function Page() {
  return (
    <PageWrapper className="flex flex-col items-start justify-start gap-10 pt-20">
      <h1 className="text-3xl">Create new group</h1>
      <NewGroupForm />
    </PageWrapper>
  );
}
