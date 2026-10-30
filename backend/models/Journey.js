const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
    referenceId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    travelers: { type: String, required: true },
    travelDate: { type: String, required: true },
    userNotes: { type: String, required: true },
    aiGeneratedPlan: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Journey', journeySchema);