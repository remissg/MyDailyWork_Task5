const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get ALL tasks for the logged in user (Global View)
router.get('/', auth, async (req, res) => {
    try {
        // 1. Find all user's projects
        // 1. Find all user's projects (Created by user OR User is a member)
        console.log(`[GET /tasks] Fetching tasks for user: ${req.user.id}`);
        const projects = await Project.find({
            $or: [
                { userId: req.user.id },
                { members: req.user.id }
            ]
        });
        console.log(`[GET /tasks] Found ${projects.length} projects for user.`);
        const projectIds = projects.map(p => p._id);

        // 2. Find tasks for those projects
        // Populate project info so we can show "Project Name" on the card
        const tasks = await Task.find({ projectId: { $in: projectIds } })
            .populate('projectId', 'title')
            .populate('assignedTo', 'name avatar');

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get tasks for a specific project
router.get('/:projectId', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId })
            .sort({ order: 1 }) // Sort by order ascending
            .populate('assignedTo', 'name avatar');
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
        status: req.body.status || 'To Do',
        assignedTo: req.body.assignedTo || null,
        description: req.body.description || '',
        priority: req.body.priority || 'Medium',
        dueDate: req.body.dueDate || null,
        order: req.body.order || 0
    });

    try {
        const newTask = await task.save();
        // Populate before sending back
        await newTask.populate('assignedTo', 'name avatar');

        // Notification: Task Assignment
        console.log(`[POST /tasks] Checking notification trigger. AssignedTo: ${req.body.assignedTo}, CurrentUser: ${req.user.id}`);
        if (req.body.assignedTo && req.body.assignedTo.toString() !== req.user.id.toString()) {
            console.log('[POST /tasks] Creating notification...');
            const notif = await Notification.create({
                recipient: req.body.assignedTo,
                sender: req.user.id,
                type: 'ASSIGNMENT',
                message: `You were assigned to task "${newTask.title}"`,
                relatedId: newTask._id,
                projectId: req.body.projectId // Add projectId link
            });
            console.log(`[POST /tasks] Notification created: ${notif._id}`);
        } else {
            console.log('[POST /tasks] Notification condition failed (Self-assignment or no assignee)');
        }

        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Reorder tasks (Bulk Update)
router.put('/reorder/batch', auth, async (req, res) => {
    try {
        const { tasks } = req.body; 
        // tasks = [{ _id: '...', order: 0, status: '...' }, ...]

        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const updatePromises = tasks.map(t => 
             Task.findByIdAndUpdate(t._id, { 
                 order: t.order, 
                 status: t.status 
             })
        );

        await Promise.all(updatePromises);
        res.json({ message: 'Tasks reordered successfully' });
    } catch (err) {
        console.error('Reorder error:', err);
        res.status(500).json({ message: 'Failed to reorder tasks' });
    }
});

// Update task status or details
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('assignedTo', 'name avatar')
            .populate('comments.userId', 'name avatar');
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add Comment
router.post('/:id/comments', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            userId: req.user.id
        };
        task.comments.push(newComment);
        await task.save();

        // Notification: New Comment
        if (task.assignedTo && task.assignedTo.toString() !== req.user.id) {
            await Notification.create({
                recipient: task.assignedTo,
                sender: req.user.id,
                type: 'COMMENT',
                message: `New comment on task "${task.title}"`,
                relatedId: task._id,
                projectId: task.projectId // Add projectId link
            });
        }

        // Return updated task with populated comments
        await task.populate('comments.userId', 'name avatar');
        await task.populate('assignedTo', 'name avatar');

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
