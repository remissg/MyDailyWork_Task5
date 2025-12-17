import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import NotificationDropdown from '../Navigation/NotificationDropdown';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="h-20 fixed top-0 right-0 left-0 md:left-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between z-40 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
                >
                    <Menu size={24} />
                </button>
                <div className="relative w-full max-w-xs hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects, tasks..."
                        className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <NotificationDropdown />

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role || 'Member'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold ring-2 ring-white overflow-hidden">
                        {user?.avatar ? (
                            <img
                                src={`http://localhost:5000${user.avatar}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
