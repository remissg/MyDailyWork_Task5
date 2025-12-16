import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { Plus, Search, Filter, MoreVertical, Calendar, Clock, CheckCircle2, Circle, AlertCircle, Trash2 } from 'lucide-react';
import api from '../services/api';

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
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm('Delete this task?')) return;

        // Optimistic Delete
        setTasks(tasks.filter(t => t._id !== taskId));

        try {
            await api.delete(`/tasks/${taskId}`);
            fetchProjects(); // Refresh projects on delete
        } catch (error) {
            console.error('Failed to delete task', error);
            fetchTasks();
        }
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

    if (loading) return <div className="text-center py-20 text-slate-500">Loading tasks...</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">My Tasks</h2>
                <p className="text-slate-500">View and manage tasks across all your projects</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    {['All', 'To Do', 'In Progress', 'Done'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                        <p className="text-slate-500">No tasks found matching your filters.</p>
                    </div>
                ) : (
                    filteredTasks.map((task, index) => (
                        <motion.div
                            key={task._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleStatusUpdate(task._id, task.status)}
                                    className={`p-2 rounded-lg transition-colors hover:bg-slate-200 ${getStatusColor(task.status)}`}
                                    title="Click to change status"
                                >
                                    {getStatusIcon(task.status)}
                                </button>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{task.title}</h3>
                                    <p className="text-xs text-slate-400">
                                        Project: <span className="font-medium text-slate-600">{task.projectId?.title || 'Unknown'}</span>
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
