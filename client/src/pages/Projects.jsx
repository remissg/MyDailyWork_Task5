import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, MoreVertical, LayoutGrid, List as ListIcon } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import CreateProjectModal from '../components/Modals/CreateProjectModal';

const Projects = () => {
    const { projects, loading } = useProjects();
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Projects</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track your ongoing projects</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    New Project
                </button>
            </div>

            {/* Filters & Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white placeholder:text-slate-400 transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            <ListIcon size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <LayoutGrid size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Projects Found</h3>
                    <p className="text-slate-500 mb-6">Get started by creating your first project.</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="text-primary font-bold hover:underline"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/app/projects/${project._id}`}>
                                <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group ${viewMode === 'list' ? 'flex items-center justify-between gap-6' : ''}`}>

                                    <div className={viewMode === 'list' ? "flex items-center gap-6 flex-1" : "mb-4"}>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${index % 3 === 0 ? 'bg-blue-50 text-blue-600' :
                                            index % 3 === 1 ? 'bg-purple-50 text-purple-600' :
                                                'bg-emerald-50 text-emerald-600'
                                            }`}>
                                            {project.title.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-1">{project.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium">{project.category || 'General'}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Calendar size={12} /> {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No date'}</span>
                                            </p>

                                            {/* Members Stack for Card */}
                                            <div className="flex -space-x-2 mt-2">
                                                {project.members?.slice(0, 3).map((member, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full border border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden" title={member.name}>
                                                        {member.avatar ? (
                                                            <img src={`http://localhost:5000${member.avatar}`} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-slate-500">{member.name?.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                ))}
                                                {project.members?.length > 3 && (
                                                    <div className="w-6 h-6 rounded-full border border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                        +{project.members.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={viewMode === 'list' ? "w-48" : "mb-4"}>
                                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                                            <span>Progress</span>
                                            <span>{project.progress || 0}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${(project.progress || 0) === 100 ? 'bg-emerald-500' : 'bg-primary'
                                                    }`}
                                                style={{ width: `${project.progress || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {viewMode === 'list' && (
                                        <div className="text-slate-400 group-hover:text-primary transition-colors">
                                            <MoreVertical size={20} />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default Projects;
