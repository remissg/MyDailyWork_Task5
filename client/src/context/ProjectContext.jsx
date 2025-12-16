import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth(); // Get user from auth context

    // Fetch Projects
    const fetchProjects = async () => {
        if (!user) return; // Don't fetch if not logged in
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    // Create Project
    const createProject = async (projectData) => {
        try {
            await api.post('/projects', projectData);
            fetchProjects(); // Refresh list
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    // Delete Project
    const deleteProject = async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            setProjects(projects.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProjects();
        } else {
            setLoading(false); // Stop loading if no user
        }
    }, [user]);

    return (
        <ProjectContext.Provider value={{ projects, loading, fetchProjects, createProject, deleteProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
