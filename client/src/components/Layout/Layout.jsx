import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-primary/30 transition-colors duration-300">
            {/* Sidebar: Z-50 to stay above overlay (Z-40) */}
            <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

            {/* Mobile Overlay: Z-40 */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Content Wrapper */}
            <div className="flex-1 md:ml-64 ml-0 transition-all duration-300 min-h-screen flex flex-col relative z-0">
                <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
                <main className="pt-24 px-4 md:px-8 pb-8 flex-1">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
