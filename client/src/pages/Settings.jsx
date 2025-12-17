import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { SERVER_BASE_URL } from '../config/constants';

import toast from 'react-hot-toast';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const fileInputRef = React.useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            // Need to use axios directly or update api.js to handle multipart
            // Assuming api instance can handle it, or we configure content-type
            // Axios automatically sets Content-Type to multipart/form-data with correct boundary for FormData
            const res = await api.post('/auth/upload-avatar', formData);
            updateUser({ avatar: res.data.avatar });
            setUploading(false);
            toast.success('Avatar updated successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Failed to upload avatar');
        }
    };

    const [name, setName] = useState(user?.name || '');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/update-profile', { name });
            updateUser({ name });
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage your account preferences</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'profile'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                    >
                        <User size={20} />
                        Profile Info
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'security'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                    >
                        <Shield size={20} />
                        Security
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
                        >
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Personal Information</h3>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center text-2xl font-bold text-slate-400 relative">
                                    {user?.avatar ? (
                                        <img src={`${SERVER_BASE_URL}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0)
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="text-sm font-semibold text-primary hover:underline"
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading...' : 'Change Avatar'}
                                    </button>
                                    <p className="text-xs text-slate-400 mt-1">JPG, GIF or PNG. 1MB Max.</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                defaultValue={user?.role}
                                                disabled
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            defaultValue={user?.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 ml-1">Email cannot be changed for security reasons.</p>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
                        >
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Security Preferences</h3>

                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
                                        <Save size={18} />
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
