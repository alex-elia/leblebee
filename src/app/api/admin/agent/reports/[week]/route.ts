import { createReportDetailHandler } from "@elia/agent-next";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ week: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { week } = await params;
  return createReportDetailHandler("leblebee", week)();
}
