export const ADMIN_EMAIL = "alex.gon@eliago.com";

export type UserRole = "admin" | "client" | "supplier";

export type Profile = {
  id: string;
  role: UserRole;
  display_name: string | null;
  preferred_language: string;
};

export function isAdminEmail(email: string | null | undefined): boolean {
  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL;
}

export function isRegistrableRole(role: string): role is "client" | "supplier" {
  return role === "client" || role === "supplier";
}

export function homePathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "client":
      return "/client";
    case "supplier":
      return "/supplier";
  }
}

export function roleLabel(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "client":
      return "Client (property owner)";
    case "supplier":
      return "Supplier (local provider)";
  }
}
