import { PageWrapper } from "~/components/page-wrapper";
import { Spinner } from "~/components/ui/spinner";

export default async function Loading() {
  return (
    <PageWrapper className="grid h-[90dvh] place-items-center">
      <Spinner />
    </PageWrapper>
  );
}
