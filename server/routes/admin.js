const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get System Stats
router.get('/stats', [auth, admin], async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

        res.json({ totalUsers, totalProjects, recentUsers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Users
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password');

        // Add stats for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const projectCount = await Project.countDocuments({ userId: user._id });
            return {
                ...user.toObject(),
                projectCount
            };
        }));

        res.json(usersWithStats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete User
router.delete('/users/:id', [auth, admin], async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Project.deleteMany({ userId: req.params.id });
        res.json({ message: 'User removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
