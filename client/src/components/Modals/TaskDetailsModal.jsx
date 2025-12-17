import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MessageSquare, User, Clock, Flag, Send } from 'lucide-react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const TaskDetailsModal = ({ isOpen, onClose, task, onUpdate }) => {
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setDescription(task.description || '');
            setPriority(task.priority || 'Medium');
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
            setComments(task.comments || []);
        }
    }, [task]);

    const handleSaveDetails = async () => {
        setLoading(true);
        try {
            const res = await api.put(`/tasks/${task._id}`, {
                description,
                priority,
                dueDate
            });
            onUpdate(res.data); // Update parent state
            setLoading(false);
            // Optionally close or show success
        } catch (error) {
            console.error('Failed to update task', error);
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const res = await api.post(`/tasks/${task._id}/comments`, { text: commentText });
            setComments(res.data.comments);
            setCommentText('');
            onUpdate(res.data); // Keep parent in sync
        } catch (error) {
            console.error('Failed to add comment', error);
        }
    };

    if (!isOpen || !task) return null;

    const priorityColors = {
        'Low': 'bg-blue-100 text-blue-700',
        'Medium': 'bg-amber-100 text-amber-700',
        'High': 'bg-red-100 text-red-700'
    };

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 left-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl max-h-[95vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-3 sm:p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${priorityColors[priority] || 'bg-slate-100 dark:bg-slate-700 dark:text-slate-300'}`}>
                                    {priority}
                                </span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white truncate">{task.title}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">

                        {/* Meta Grid */}
                        <div className="space-y-4">

                            {/* Assignee & Created By Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Assignee */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <User size={12} /> Assignee
                                    </label>
                                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                        {task.assignedTo ? (
                                            <>
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {task.assignedTo.avatar ? (
                                                        <img src={`http://localhost:5000${task.assignedTo.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="font-bold text-indigo-500 dark:text-indigo-400 text-xs">{task.assignedTo.name?.[0]}</span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{task.assignedTo.name}</span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-slate-400 italic">Unassigned</span>
                                        )}
                                    </div>
                                </div>


                                {/* Created By */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <User size={12} /> Created By
                                    </label>
                                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                        {task.createdBy ? (
                                            <>
                                                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {task.createdBy.avatar ? (
                                                        <img src={`http://localhost:5000${task.createdBy.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">{task.createdBy.name?.[0]}</span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{task.createdBy.name}</span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-slate-400 italic">Unknown</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Due Date & Priority Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Calendar size={12} /> Due Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        onBlur={handleSaveDetails}
                                        className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 dark:text-slate-200"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Flag size={12} /> Priority
                                    </label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        onBlur={handleSaveDetails}
                                        className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 dark:text-slate-200 appearance-none cursor-pointer"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                Describe this task
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={handleSaveDetails}
                                placeholder="Add a more detailed description..."
                                className="w-full min-h-[120px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-y text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                            />
                        </div>

                        {/* Comments Section */}
                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <MessageSquare size={14} /> Discussion
                            </label>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {comments.length === 0 ? (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        <p className="text-sm text-slate-400">No comments yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    comments.map((comment, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden mt-1">
                                                {comment.userId?.avatar ? (
                                                    <img src={`http://localhost:5000${comment.userId.avatar}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-500 dark:text-slate-400">
                                                        {comment.userId?.name?.[0] || '?'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl rounded-tl-none border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{comment.userId?.name || 'Unknown User'}</span>
                                                    <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Comment */}
                            <form onSubmit={handleAddComment} className="relative mt-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-4 pr-12 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white placeholder:text-slate-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    className="absolute right-1.5 top-1.5 p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>

                    </div>

                    {/* Footer (Actions) */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                        <button
                            onClick={handleSaveDetails}
                            className={`px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </motion.div>
            </div >
        </AnimatePresence >
    );
};

export default TaskDetailsModal;
