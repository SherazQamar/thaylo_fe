import Sidebar from "@/components/wayfinder/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#111023]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-[56px] pb-[72px] md:pt-0 md:pb-0">{children}</main>
    </div>
  );
}
