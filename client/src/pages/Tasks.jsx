import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { Plus, Search, Filter, MoreVertical, Calendar, Clock, CheckCircle2, Circle, AlertCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Tasks = () => {
    const { user } = useAuth();
    const { fetchProjects } = useProjects();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, currentStatus) => {
        const statusOrder = ['To Do', 'In Progress', 'Done'];
        const nextStatusIndex = (statusOrder.indexOf(currentStatus) + 1) % 3;
        const nextStatus = statusOrder[nextStatusIndex];

        // Optimistic Update
        const updatedTasks = tasks.map(t => t._id === taskId ? { ...t, status: nextStatus } : t);
        setTasks(updatedTasks);

        try {
            await api.put(`/tasks/${taskId}`, { status: nextStatus });
            fetchProjects(); // Refresh projects to update progress lines
        } catch (error) {
            console.error('Failed to update status', error);
            fetchTasks(); // Revert on error
            toast.error('Failed to update status');
        }
    };

    const handleDelete = (taskId) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <span className="font-medium text-slate-800">Delete this task?</span>
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            // Optimistic Delete
                            setTasks(prev => prev.filter(t => t._id !== taskId));
                            try {
                                await api.delete(`/tasks/${taskId}`);
                                fetchProjects(); // Refresh projects to update progress lines
                                toast.success('Task deleted');
                            } catch (error) {
                                console.error('Failed to delete task', error);
                                fetchTasks(); // Revert
                                toast.error('Failed to delete task');
                            }
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-slate-100 text-slate-600 px-3 py-1 rounded text-sm hover:bg-slate-200 transition-colors border border-slate-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 4000,
            position: 'top-center'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Done': return 'text-emerald-500 bg-emerald-50';
            case 'In Progress': return 'text-blue-500 bg-blue-50';
            default: return 'text-slate-500 bg-slate-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Done': return <CheckCircle2 size={18} />;
            case 'In Progress': return <Clock size={18} />;
            default: return <Circle size={18} />;
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'All' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleExportCSV = () => {
        const headers = ['Title', 'Status', 'Project', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...filteredTasks.map(task => [
                `"${task.title.replace(/"/g, '""')}"`,
                task.status,
                `"${(task.projectId?.title || 'Unknown').replace(/"/g, '""')}"`,
                new Date(task.createdAt).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'my_tasks_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="text-center py-20 text-slate-500">Loading tasks...</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">My Tasks</h2>
                <p className="text-slate-500 dark:text-slate-400">View and manage tasks across all your projects</p>
            </div>

            {/* Controls */}
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1 w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary transition-colors text-sm font-medium shadow-sm w-full sm:w-auto"
                        title="Export filtered tasks to CSV"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                        Export
                    </button>
                    <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto">
                        {['All', 'To Do', 'In Progress', 'Done'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${filter === f ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                        <p className="text-slate-500 dark:text-slate-400">No tasks found matching your filters.</p>
                    </div>
                ) : (
                    filteredTasks.map((task, index) => (
                        <motion.div
                            key={task._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleStatusUpdate(task._id, task.status)}
                                    className={`p-2 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 ${getStatusColor(task.status)}`}
                                    title="Click to change status"
                                >
                                    {getStatusIcon(task.status)}
                                </button>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{task.title}</h3>
                                    <p className="text-xs text-slate-400">
                                        Project: <span className="font-medium text-slate-600 dark:text-slate-300">{task.projectId?.title || 'Unknown'}</span>
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Assigned by: <span className="font-medium text-slate-600 dark:text-slate-300">{task.createdBy?.name || 'Unknown'}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => handleStatusUpdate(task._id, task.status)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(task.status)}`}
                                >
                                    {task.status}
                                </button>
                                <span className="text-xs text-slate-400">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Task"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tasks;
