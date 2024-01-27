export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  return <>organiser - {groupId}</>;
}
