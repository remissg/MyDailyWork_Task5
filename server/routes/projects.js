const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get all projects for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate('members', 'name avatar email'); // Populate members

        // Calculate progress for each project
        const projectsWithData = await Promise.all(projects.map(async (project) => {
            const tasks = await Task.find({ projectId: project._id });
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.status === 'Done').length;
            const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

            return {
                ...project.toObject(),
                progress,
                totalTasks,
                activeTasks: totalTasks - completedTasks,
            };
        }));

        res.json(projectsWithData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new project
router.post('/', auth, async (req, res) => {
    const project = new Project({
        title: req.body.title,
        category: req.body.category,
        dueDate: req.body.dueDate,
        userId: req.user.id,
        members: [req.user.id] // Add creator as member
    });

    try {
        const newProject = await project.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Make sure user owns project
        if (project.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Project.findByIdAndDelete(req.params.id);
        await Task.deleteMany({ projectId: req.params.id }); // Cascade delete tasks
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
