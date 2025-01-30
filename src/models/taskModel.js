const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    priority: { type: String, enum: ['Urgent', 'Medium', 'Low priority'], required: true, default: 'Low priority' },
    status: { type: String, enum: ['In plan', 'In progress', 'Done'], required: true, default: 'In plan'},
    color: { type: String, default: '#fff' },
    reminder: { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,},
    dashboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Dashboard', required: true }, // Привязка к доске
});

module.exports = mongoose.model('Task', taskSchema);
