import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/Header/Header";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
}
