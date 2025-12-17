import React from 'react';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, LogOut, Shield, Moon, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/app', end: true },
        { icon: <FolderKanban size={20} />, label: 'Projects', path: '/app/projects' },
        { icon: <CheckSquare size={20} />, label: 'My Tasks', path: '/app/tasks' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/app/settings' },
    ];

    if (user?.role === 'admin') {
        navItems.push({ icon: <Shield size={20} />, label: 'Admin Panel', path: '/app/admin' });
    }

    return (
        <>
            <aside
                className={clsx(
                    "w-64 h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col z-50 transition-transform duration-300 ease-in-out",
                    // Mobile: closed by default (-translate-x-full), open if isOpen
                    // Desktop (md): always open (translate-x-0), ignoring isOpen
                    {
                        '-translate-x-full md:translate-x-0': !isOpen,
                        'translate-x-0': isOpen
                    }
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-xl font-bold text-slate-800 dark:text-white">PMS Pro</span>
                    </div>
                    {/* Close button for mobile */}
                    {isOpen && (
                        <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
                            {/* Simple close icon or just area click */}
                        </button>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={() => onClose()} // Close on navigate (mobile)
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                    isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                )}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
