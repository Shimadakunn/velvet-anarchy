import AdminLogin from "@/components/AdminLogin";
import { isAuthenticated } from "@/lib/server/auth";

export default async function HeroLayout({
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
