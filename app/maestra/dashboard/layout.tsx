import { verifySession } from "@/lib/dal";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — NIKA Admin",
  robots: "noindex, nofollow",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificación server-side — redirige al login si no hay sesión válida
  const { usuario } = await verifySession();

  return (
    <div className="min-h-screen bg-slate-50/60 flex">
      {/* Sidebar lateral */}
      <Sidebar usuario={usuario} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader usuario={usuario} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
