const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    priority: { type: String, enum: ['Urgent', 'Medium', 'Low priority'], required: true },
    status: { type: String, enum: ['In plan', 'In progress', 'Done'], required: true },
    color: { type: String, default: '#fff' },
    reminder: { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
