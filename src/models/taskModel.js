const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    status: { type: String, enum: ['All', 'In Progress', 'Done'], default: 'All' },
    createdAt: { type: Date, default: Date.now },
    repeatMode: { type: String, enum: ['None', 'Daily', 'Weekly', 'Monthly'], default: 'None' },
});

module.exports = mongoose.model('Task', taskSchema);
