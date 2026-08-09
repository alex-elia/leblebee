import { AgentAdminWeekPage } from "@elia/agent-next";

type Props = {
  params: Promise<{ week: string }>;
};

export default async function Page({ params }: Props) {
  const { week } = await params;
  return <AgentAdminWeekPage siteId="leblebee" weekKey={week} />;
}
