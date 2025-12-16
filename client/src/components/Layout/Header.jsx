import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 fixed top-0 right-0 left-64 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-40">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search projects, tasks..."
                    className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-slate-400 hover:text-primary transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-700">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role || 'Member'}</p>
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
