import { createWeeklyReportHandler } from "@elia/agent-next";

export const runtime = "nodejs";

const handler = createWeeklyReportHandler({
  siteId: "leblebee",
  subjectPrefix: "Leblebee",
});

export const GET = handler;
export const POST = handler;
