import { requireAuthenticatedSession } from "@/lib/auth";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  requireAuthenticatedSession();
  return children;
}
