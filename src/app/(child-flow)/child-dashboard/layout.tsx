import ChildAuthGuard from "@/components/child/ChildAuthGuard";
import ChildSidebar from "@/components/child/ChildSidebar";

export default function ChildDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChildAuthGuard>
      <div className="h-screen flex overflow-hidden bg-[#111023]">
        <ChildSidebar />
        <main className="flex-1 overflow-y-auto pt-[56px] pb-[72px] md:pt-0 md:pb-0">{children}</main>
      </div>
    </ChildAuthGuard>
  );
}
