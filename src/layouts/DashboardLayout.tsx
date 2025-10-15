import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';

interface Props {
  children: React.ReactNode;
  hideSidebarOnDesktop?: boolean;
}

export const DashboardLayout: React.FC<Props> = ({ children, hideSidebarOnDesktop = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        {!hideSidebarOnDesktop && (
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Mobile header */}
          <Header onMenuClick={toggleSidebar} />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
