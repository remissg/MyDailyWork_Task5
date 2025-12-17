import React, { useState, useEffect } from 'react';
import { Users, FolderKanban, Trash2, Shield, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const statsRes = await api.get('/admin/stats');
            const usersRes = await api.get('/admin/users');
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                console.error('Failed to delete user', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950 text-primary">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Admin Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400">System Overview & User Management</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Total Users</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalUsers}</h3>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                        <FolderKanban size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Total Projects</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalProjects}</h3>
                    </div>
                </motion.div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Registered Users</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Projects</th>
                                <th className="p-4 font-medium">Joined</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-medium">{user.name}</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {user.role === 'admin' ? (
                                            <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit">
                                                <Shield size={12} /> Admin
                                            </span>
                                        ) : (
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium">
                                                User
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                                        {user.projectCount || 0}
                                    </td>
                                    <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => deleteUser(user._id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
