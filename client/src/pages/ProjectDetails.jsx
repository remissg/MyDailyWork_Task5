import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { ArrowLeft, Plus, Trash2, Flag } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskDetailsModal from '../components/Modals/TaskDetailsModal';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects } = useProjects();
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    // Task Modal State
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInviteMember = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/projects/${id}/members`, { email: inviteEmail });
            setProject(res.data); // Update project with new member list
            setIsInviteOpen(false);
            setInviteEmail('');
            alert('Member added successfully!');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to add member');
        }
    };

    // Find project
    useEffect(() => {
        const foundProject = projects.find(p => p._id === id);
        if (foundProject) setProject(foundProject);
    }, [id, projects]);

    // Fetch Tasks
    useEffect(() => {
        if (id) {
            api.get(`/tasks/${id}`)
                .then(res => setTasks(res.data))
                .catch(err => console.error(err));
        }
    }, [id]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const assignToId = document.getElementById('assignSelect')?.value || null;
            const res = await api.post('/tasks', {
                title: newTaskTitle,
                projectId: id,
                status: 'To Do',
                assignedTo: assignToId
            });
            setTasks([...tasks, res.data]);
            setNewTaskTitle('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTask = async (taskId, e) => {
        e.stopPropagation(); // Prevent modal opening
        if (!window.confirm('Delete task?')) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(t => t._id !== taskId));
        } catch (error) {
            console.error(error);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const startStatus = source.droppableId;
        const finishStatus = destination.droppableId;

        // Clone current tasks to avoid mutation
        let newTasks = Array.from(tasks);

        if (startStatus === finishStatus) {
            // Reordering in SAME column
            const columnTasks = newTasks
                .filter(t => t.status === startStatus)
                .sort((a, b) => (a.order || 0) - (b.order || 0)); // Ensure sorted by current order

            const [movedTask] = columnTasks.splice(source.index, 1);
            columnTasks.splice(destination.index, 0, movedTask);

            // Update local state with new orders
            const updatedColumnTasks = columnTasks.map((t, index) => ({
                ...t,
                order: index
            }));

            // Merge back into main tasks array
            newTasks = newTasks.map(t => {
                const updated = updatedColumnTasks.find(u => u._id === t._id);
                return updated ? updated : t;
            });

            setTasks(newTasks);

            // Send batch update
            try {
                await api.put('/tasks/reorder/batch', { tasks: updatedColumnTasks });
            } catch (error) {
                console.error('Failed to save order', error);
            }

        } else {
            // Moving to DIFFERENT column
            const task = newTasks.find(t => t._id === draggableId);
            const destColumnTasks = newTasks
                .filter(t => t.status === finishStatus)
                .sort((a, b) => (a.order || 0) - (b.order || 0));

            // Remove from source (handled by filter essentially, but we need to update status)
            // Insert into destination at specific index
            destColumnTasks.splice(destination.index, 0, { ...task, status: finishStatus });

            // Re-index destination column
            const updatedDestTasks = destColumnTasks.map((t, index) => ({
                ...t,
                status: finishStatus, // Ensure status is set
                order: index
            }));

            // Prepare tasks for batch update (only the moved task needs status update, but all in dest need order update)
            // We also technically should re-index the source column, but for simplicity we can just update the dest column + the moved task.
            // Actually, clean way: just send update for the moved task + affected column re-indexing.

            // Local update: Update the moved task's status immediately
            // And update orders for destination column
            newTasks = newTasks.map(t => {
                const updated = updatedDestTasks.find(u => u._id === t._id);
                return updated ? updated : t;
            });

            setTasks(newTasks);

            try {
                // We need to sending the moved task (with new status) AND the re-ordered destination column
                await api.put('/tasks/reorder/batch', { tasks: updatedDestTasks });
            } catch (error) {
                console.error('Failed to save status/order', error);
                // Revert on failure logic could be added here
            }
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
        setSelectedTask(updatedTask);
    };

    if (!project) return <div className="text-slate-800 p-8">Loading or Project Not Found...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/app')}
                className="flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Dashboard
            </button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{project.title}</h1>
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                        <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium">
                            {project.category}
                        </span>
                        <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>

                    {/* Members Section */}
                    <div className="flex items-center gap-4 mt-4 relative">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 font-medium">Team:</span>
                            <div className="flex -space-x-2">
                                {project.members?.map((member, index) => (
                                    <div key={member._id || index} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden" title={member.name}>
                                        {member.avatar ? (
                                            <img src={`http://localhost:5000${member.avatar}`} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold text-slate-500">{member.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Invite Button & Popover */}
                        <div className="relative">
                            <button
                                onClick={() => setIsInviteOpen(!isInviteOpen)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-colors border-2 border-dashed border-slate-300 hover:border-transparent"
                                title="Invite Member"
                            >
                                <Plus size={16} />
                            </button>

                            {isInviteOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="absolute top-10 left-0 z-50 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl w-64"
                                >
                                    <h4 className="font-bold text-slate-800 dark:text-white mb-2">Invite Member</h4>
                                    <form onSubmit={handleInviteMember}>
                                        <input
                                            type="email"
                                            placeholder="Enter email address"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-primary text-slate-900 dark:text-white"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            required
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsInviteOpen(false)}
                                                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-xl flex flex-col items-center shadow-sm">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="text-xl font-bold text-primary">{project.progress || 0}%</span>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {['To Do', 'In Progress', 'Done'].map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 min-h-[500px] transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-slate-800 border-primary/20' : ''
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                        <h3 className="font-bold text-slate-700 dark:text-slate-200">{status}</h3>
                                        <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded-md text-xs text-slate-500 dark:text-slate-300 shadow-sm">
                                            {tasks.filter(t => t.status === status).length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {tasks
                                            .filter(t => t.status === status)
                                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                                            .map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{ ...provided.draggableProps.style }}
                                                            onClick={() => handleTaskClick(task)}
                                                            className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm hover:border-primary/30 group transition-all relative cursor-pointer ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/50 rotate-2' : ''
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className="text-slate-800 dark:text-white font-medium pr-6">{task.title}</p>
                                                                <button
                                                                    onClick={(e) => handleDeleteTask(task._id, e)}
                                                                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="mt-3 flex items-center justify-between">
                                                                {/* Assignee Avatar */}
                                                                {task.assignedTo ? (
                                                                    <div className="flex items-center gap-2" title={`Assigned to ${task.assignedTo.name}`}>
                                                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                                                                            {task.assignedTo.avatar ? (
                                                                                <img src={`http://localhost:5000${task.assignedTo.avatar}`} alt={task.assignedTo.name} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                                                    {task.assignedTo.name?.charAt(0)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-xs text-slate-500">{task.assignedTo.name}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                                                                )}

                                                                {/* Priority Indicator */}
                                                                {task.priority && task.priority !== 'Medium' && (
                                                                    <div className={`p-1 rounded bg-slate-50 ${task.priority === 'High' ? 'text-red-500' : 'text-blue-500'}`} title={`Priority: ${task.priority}`}>
                                                                        <Flag size={12} fill="currentColor" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>

                                    {status === 'To Do' && (
                                        <form onSubmit={handleAddTask} className="mt-4">
                                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 focus-within:border-primary/50 transition-colors shadow-sm">
                                                <Plus size={18} className="text-slate-400 ml-2" />
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-none outline-none text-sm text-slate-800 dark:text-white w-full placeholder:text-slate-400"
                                                    placeholder="Add new task..."
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                />
                                                {/* Quick Assign Dropdown */}
                                                <select
                                                    className="bg-slate-50 dark:bg-slate-800 border-none text-xs text-slate-500 dark:text-slate-400 rounded-lg py-1 px-2 focus:ring-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors max-w-[100px] truncate"
                                                    id="assignSelect"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {project.members?.filter(m => m && m._id).map(m => (
                                                        <option key={m._id} value={m._id}>{m.name}</option>
                                                    ))}
                                                </select>
                                                <button type="submit" className="bg-primary text-white p-1.5 rounded-lg hover:bg-primary/90 transition-colors">
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {/* Task Details Modal */}
            <TaskDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
                onUpdate={handleTaskUpdate}
            />
        </div>
    );
};

export default ProjectDetails;
