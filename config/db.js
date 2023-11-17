require('dotenv').config();
const mongoose = require('mongoose');

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
        // You can start performing database operations here
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

connectToMongoDB();