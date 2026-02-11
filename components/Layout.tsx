
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-brand-light font-sans text-gray-800 overflow-hidden text-base">
            {/* Sidebar Navigation */}
            <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header />

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto bg-brand-light">
                    <div className="w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
