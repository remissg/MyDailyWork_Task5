const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get ALL tasks for the logged in user (Global View)
router.get('/', auth, async (req, res) => {
    try {
        // 1. Find all user's projects
        const projects = await Project.find({ userId: req.user.id });
        const projectIds = projects.map(p => p._id);

        // 2. Find tasks for those projects
        // Populate project info so we can show "Project Name" on the card
        const tasks = await Task.find({ projectId: { $in: projectIds } }).populate('projectId', 'title');

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get tasks for a specific project
router.get('/:projectId', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create task
router.post('/', auth, async (req, res) => {
    const task = new Task({
        title: req.body.title,
        projectId: req.body.projectId,
        status: req.body.status || 'To Do'
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update task status
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
