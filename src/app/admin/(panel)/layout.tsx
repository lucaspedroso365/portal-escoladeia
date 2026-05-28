import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A1A]">
      <div className="flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
