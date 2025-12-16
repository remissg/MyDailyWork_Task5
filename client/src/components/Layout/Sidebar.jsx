import React from 'react';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, LogOut, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/app' },
        { icon: <FolderKanban size={20} />, label: 'Projects', path: '/app/projects' },
        { icon: <CheckSquare size={20} />, label: 'My Tasks', path: '/app/tasks' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/app/settings' },
    ];

    if (user?.role === 'admin') {
        navItems.push({ icon: <Shield size={20} />, label: 'Admin Panel', path: '/app/admin' });
    }

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-100 flex flex-col z-50">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <span className="text-xl font-bold text-slate-800">PMS Pro</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                            )}
                    >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
