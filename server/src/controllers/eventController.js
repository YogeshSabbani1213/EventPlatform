import Event from '../models/EventModel.js';

//For creating an event 
export const createEvent = async (req, res) => {
    try {
        const { title, description, dateTime, location, capacity } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        const event = await Event.create({ // to create in mongoDB
            title,
            description,
            dateTime,
            location,
            capacity,
            image: req.file.path,
            createdBy: req.user._id,
        })
        return res.status(201).json(event)

    }
    catch (error) {
        return res.status(500).json({ message: 'Event creation failed', error: error.message })
    }
}

//For fetching all Events
export const getAllEvents = async (req, res) => {
    try {
        const { search, date } = req.query;
        let query = {};
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }
        if (date) {
            query.dateTime = { $gte: new Date(date) };
        }

        const events = await Event.find()
            .sort({ dateTime: 1 })
            .populate("createdBy", "username")

        return res.status(200).json(events);
    }
    catch (error) {
        return res.status(500).json({ message: 'cant retrieve events', error: error.message });
    }

}


//For fetching an event using ID 
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("createdBy", "username")
            .populate("attendees", "username")

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json(event);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch event", error: error.message });
    }
}


//For deleting an event 
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        await event.deleteOne()
        return res.status(201).json({ message: 'Deleted Succesfully' });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete event", error: error.message });
    }

}

//For updating an event 
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // --- DEBUG LOGGING 
        console.log("Event Creator:", event.createdBy);
        console.log("Request User:", req.user);
        // -----------------------------------------------------------

        // SAFETY CHECK 1: If the event has no creator (Old data?)
        if (!event.createdBy) {
             return res.status(403).json({ message: "Event has no creator. Cannot verify ownership." });
        }

        // SAFETY CHECK 2: If req.user is missing (Middleware failed?)
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated properly." });
        }

        // CHECK OWNERSHIP
        // Handle cases where createdBy might be an object or a string
        const creatorId = event.createdBy._id ? event.createdBy._id.toString() : event.createdBy.toString();
        const userId = req.user._id.toString();

        if (creatorId !== userId) {
            return res.status(403).json({ message: "Not Authorized to edit this event" });
        }

        // UPDATE FIELDS
        const { title, description, dateTime, location, capacity } = req.body;
        
        if (title) event.title = title;
        if (description) event.description = description;
        if (dateTime) event.dateTime = dateTime;
        if (location) event.location = location;
        if (capacity) event.capacity = capacity;

        if (req.file) {
            event.image = req.file.path;
        }

        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);

    } catch (error) {
        console.error("SERVER CRASH:", error); // This prints the full error
        res.status(500).json({ message: "Update failed", error: error.message });
    }

}