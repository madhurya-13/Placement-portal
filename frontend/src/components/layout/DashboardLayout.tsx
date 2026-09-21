// src/components/layout/DashboardLayout.tsx
import { useState, type ReactNode } from "react";
import Sidebar, { type NavLink } from "./Sidebar";
import Topbar from "./Topbar";

interface DashboardLayoutProps {
  navLinks: NavLink[];
  pageTitle: string;
  children: ReactNode;
}

export default function DashboardLayout({ navLinks, pageTitle, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar links={navLinks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0">
        <Topbar title={pageTitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-5 md:p-7">{children}</main>
      </div>
    </div>
  );
}