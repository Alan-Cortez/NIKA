import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso Administrativo — NIKA",
  description: "Panel de administración exclusivo para la maestra Aned.",
  robots: "noindex, nofollow",
};

export default function MaestraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
