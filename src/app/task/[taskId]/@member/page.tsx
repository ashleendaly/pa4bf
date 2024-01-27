export default async function Page({
  params: { taskId },
}: {
  params: { taskId: string };
}) {
  return (
    <>
      <div>Member - {taskId}</div>
      <div></div>
    </>
  );
}
