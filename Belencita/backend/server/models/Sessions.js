import mongoose from 'mongoose';

const sessionsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    messages: {
        type: Array,
        required: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    sessionName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Session = mongoose.model('Session', sessionsSchema);
export default Session;
