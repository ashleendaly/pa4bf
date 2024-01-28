export default async function Page({
  params: { groupId },
}: {
  params: { groupId: string };
}) {
  return (
    <>
      <div>Member - {groupId}</div>
      <div></div>
    </>
  );
}
