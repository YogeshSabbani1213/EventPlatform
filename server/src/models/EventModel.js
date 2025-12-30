import mongoose from 'mongoose';
import User from './UserModel.js';
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        // unique:true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
    },
    image: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",

        },
    ],
},
    {
        timestamps: true
    }
)

const EventModel = mongoose.model('Event', eventSchema);
export default EventModel;