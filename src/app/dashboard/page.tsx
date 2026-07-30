import { redirect } from "next/navigation";
import { getProfile, homePathForRole } from "@/lib/auth/session";

/** Legacy path — send users to their persona home. */
export default async function DashboardRedirect() {
  const session = await getProfile();
  if (!session) redirect("/login");
  redirect(homePathForRole(session.profile.role));
}
