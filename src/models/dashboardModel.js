const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Название доски
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Привязка к пользователю
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dashboard', dashboardSchema);
