import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects } = useProjects();
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');

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
            const res = await api.post('/tasks', {
                title: newTaskTitle,
                projectId: id,
                status: 'To Do'
            });
            setTasks([...tasks, res.data]);
            setNewTaskTitle('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTask = async (taskId) => {
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

        const task = tasks.find(t => t._id === draggableId);
        const newStatus = destination.droppableId;

        // Optimistic Update
        const updatedTasks = tasks.map(t =>
            t._id === draggableId ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks);

        try {
            await api.put(`/tasks/${draggableId}`, { status: newStatus });
        } catch (error) {
            console.error('Failed to update task status', error);
            // Revert on failure (optional, but good practice)
            setTasks(tasks);
        }
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
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{project.title}</h1>
                    <div className="flex items-center gap-4 text-slate-500">
                        <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium">
                            {project.category}
                        </span>
                        <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 px-6 py-3 rounded-xl flex flex-col items-center shadow-sm">
                    <span className="text-sm text-slate-500">Progress</span>
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
                                    className={`bg-slate-100/50 backdrop-blur-md border border-slate-200 rounded-2xl p-4 min-h-[500px] transition-colors ${snapshot.isDraggingOver ? 'bg-slate-100 border-primary/20' : ''
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                                        <h3 className="font-bold text-slate-700">{status}</h3>
                                        <span className="bg-white px-2 py-1 rounded-md text-xs text-slate-500 shadow-sm">
                                            {tasks.filter(t => t.status === status).length}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {tasks
                                            .filter(t => t.status === status)
                                            .map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{ ...provided.draggableProps.style }}
                                                            className={`bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-primary/30 group transition-all ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/50 rotate-2' : ''
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className="text-slate-800 font-medium">{task.title}</p>
                                                                <button
                                                                    onClick={() => handleDeleteTask(task._id)}
                                                                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>

                                    {status === 'To Do' && (
                                        <form onSubmit={handleAddTask} className="mt-4">
                                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2 focus-within:border-primary/50 transition-colors shadow-sm">
                                                <Plus size={18} className="text-slate-400" />
                                                <input
                                                    type="text"
                                                    className="bg-transparent border-none outline-none text-sm text-slate-800 w-full placeholder:text-slate-400"
                                                    placeholder="Add new task..."
                                                    value={newTaskTitle}
                                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                                />
                                            </div>
                                        </form>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default ProjectDetails;
