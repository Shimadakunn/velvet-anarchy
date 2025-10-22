import { isAuthenticated } from "@/lib/server/auth";
import AdminLogin from "@/components/AdminLogin";

export default async function ModifyProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
