import React, { useState } from 'react';
import { Plus, MoreVertical, Calendar, Clock, Loader2, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/Modals/CreateProjectModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const StatCard = ({ label, value, trend, trendUp, to }) => {
    const CardContent = (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all ${to ? 'cursor-pointer group' : ''}`}
        >
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">{label}</p>
            <div className="flex items-end justify-between">
                <h3 className={`text-3xl font-bold text-slate-800 dark:text-white ${to ? 'group-hover:text-primary transition-colors' : ''}`}>{value}</h3>
                <span className={`text-sm py-1 px-2 rounded-lg ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trend}
                </span>
            </div>
        </motion.div>
    );

    return to ? <Link to={to} className="block">{CardContent}</Link> : CardContent;
};

const ProjectCard = ({ project }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            onClick={() => navigate(`/app/projects/${project._id}`)}
            whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.5)' }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all group cursor-pointer hover:shadow-md"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {project.category}
                </span>
                <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={18} />
                </button>
            </div>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{project.title}</h3>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm mb-6">
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{project.activeTasks || 0} active tasks</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="text-primary font-medium">{project.progress || 0}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                        style={{ width: `${project.progress || 0}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
                <div className="flex -space-x-2">
                    {project.members && project.members.map((m, i) => {
                        const initial = typeof m === 'object' ? m.name?.charAt(0) : m?.charAt(0);
                        return (
                            <div key={i} className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300 ring-2 ring-transparent group-hover:ring-primary/20 transition-all shadow-sm" title={typeof m === 'object' ? m.name : m}>
                                {initial}
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { projects, loading } = useProjects();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    const totalProjects = projects.length;
    const activeTasks = projects.reduce((acc, curr) => acc + (curr.activeTasks || 0), 0);
    const completedProjects = projects.filter(p => p.progress === 100).length;

    // Analytics Data Preparation
    const statusData = [
        { name: 'Completed', value: completedProjects },
        { name: 'In Progress', value: totalProjects - completedProjects },
    ];

    const categoryData = projects.reduce((acc, curr) => {
        const category = curr.category || 'Uncategorized';
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.projects += 1;
        } else {
            acc.push({ name: category, projects: 1 });
        }
        return acc;
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">Dashboard</h2>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back! Manage your projects efficiently.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
                >
                    <Plus size={20} />
                    <span>New Project</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Projects" value={totalProjects} trend="Active" trendUp={true} to="/app/projects" />
                <StatCard label="Active Tasks" value={activeTasks} trend="Ongoing" trendUp={true} to="/app/tasks" />
                <StatCard label="Completed Projects" value={completedProjects} trend="Done" trendUp={true} to="/app/projects" />
                <StatCard label="My Profile" value={user?.name?.split(' ')[0] || 'Me'} trend="Online" trendUp={true} to="/app/settings" />
            </div>

            {/* Analytics Section */}
            {projects.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <PieIcon size={18} className="text-primary" />
                                Project Status
                            </h3>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <TrendingUp size={18} className="text-primary" />
                                Projects by Category
                            </h3>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="projects" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            )}

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your Projects</h3>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">No projects yet. Create one to get started!</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-primary hover:underline"
                        >
                            Create New Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                )}
            </div>

            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Dashboard;
