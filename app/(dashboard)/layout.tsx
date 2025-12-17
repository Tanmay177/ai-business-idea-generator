// Dashboard layout for authenticated routes
// This route group provides a shared layout for dashboard pages

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
