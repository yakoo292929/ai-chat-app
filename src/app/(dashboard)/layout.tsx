/**
 * ===========================================================================================
 * SYSTEM NAME    : ai-chart-app
 * PROGRAM ID     : src/app/(dashboad)/layout.tsx
 * PROGRAM NAME   : layout.tsx
 *                : 基本レイアウト画面
 * DEVELOPED BY   : yamabakery
 * CREATE DATE    : 2024/09/01
 * CREATE AUTHOR  : yakoo292929
 * ===========================================================================================
**/

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  /////////////////////////////////////////////
  // 画面表示
  /////////////////////////////////////////////
  return (
    <div className="flex h-full">
      <div className="hidden bg-red-400 lg:w-1/5 lg:block"><Sidebar /></div>
      <main className="bg-blue-200 w-full lg:w-4/5">
        <div className="flex flex-col h-full">
          <Navbar />
          {children}
        </div>
      </main>
    </div>
  );

}
