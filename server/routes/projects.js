const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User'); // Import User model
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Add member to project by email
router.put('/:id/members', auth, async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`[Inviting Memember] Request to invite email: "${email}" to project ${req.params.id}`);

        // 1. Find user by email (case insensitive)
        const userToAdd = await User.findOne({ email: email.toLowerCase() }); // Ensure lowercase match if stored as such, or regex
        // Better: usage regex for case insensitive search
        // const userToAdd = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

        if (!userToAdd) {
            console.log(`[Inviting Member] User not found for email: "${email}"`);
            return res.status(404).json({ message: 'User not found with this email' });
        }
        console.log(`[Inviting Member] Found user: ${userToAdd.name} (${userToAdd._id})`);
        if (!userToAdd) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // 2. Check auth (Only owner/members can add? For now let's say only owner)
        // if (project.userId.toString() !== req.user.id) {
        //     return res.status(401).json({ message: 'Not authorized' });
        // }

        // 3. Add to members if not already there (using addToSet to handle uniqueness at DB level)
        project.members.addToSet(userToAdd._id);
        await project.save();

        // Notification: Project Invitation
        if (userToAdd._id.toString() !== req.user.id) {
            await Notification.create({
                recipient: userToAdd._id,
                sender: req.user.id,
                type: 'INVITE',
                message: `You were added to project "${project.title}"`,
                relatedId: project._id
            });

            // Send Email
            const sendEmail = require('../services/email');
            const emailHtml = `
                <h3>Hello ${userToAdd.name},</h3>
                <p>You have been added to the project <strong>${project.title}</strong> by ${req.user.name || 'a team member'}.</p>
                <p>Login to view the project: <a href="http://localhost:5173/app/projects/${project._id}">View Project</a></p>
            `;
            sendEmail(userToAdd.email, `Project Invitation: ${project.title}`, emailHtml);
        }

        // Return updated project with populated members
        const updatedProject = await Project.findById(req.params.id)
            .populate('members', 'name avatar email');

        res.json(updatedProject);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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
