import { createAdminLoginHandler } from "@elia/agent-next";

export const runtime = "nodejs";

export const POST = createAdminLoginHandler();
