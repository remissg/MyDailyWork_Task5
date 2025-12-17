const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pms_db')
    .then(async () => {
        console.log('Connected to DB');
        const users = await User.find({});
        console.log('--- ALL USERS ---');
        users.forEach(u => console.log(`${u.name}: ${u.email}`));
        console.log('-----------------');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
