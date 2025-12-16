import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/30">
            <div className="relative z-10 flex">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <Header />
                    <main className="pt-24 px-8 pb-8 min-h-screen">
                        <div className="max-w-7xl mx-auto animate-fade-in">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
