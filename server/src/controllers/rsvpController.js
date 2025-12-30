import Event from '../models/EventModel.js';
export const rsvpEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        
        if (!event) {
            return res.status(400).json({ message: "Event not found" });
        }

        if(event.attendees.includes(userId)){
            return res.status(400).json({message:"User already RSVP'd"})
        }

        if(event.attendees.length>=event.capacity){
            return res.status(400).json({message:"Seats are full"});
        }

        event.attendees.push(userId);
        await event.save();

        return res.status(200).json({ message: 'RSVP succesful', attendeesCount: event.attendees.length });
    }
    catch (error) {
        return res.status(500).json({ message: "RSVP failed" ,error: error.message})
    }
}

export const cancelRsvp = async (req, res) => {
    try {

        const eventId = req.params.id;
        const userId = req.user._id;
        const event = await Event.findByIdAndUpdate(
            eventId,
            {
                $pull: { attendees: userId }
            },
            { new: true },
        )
        return res.status(200).json({
            message: "RSVP cancelled",
            attendeesCount: event.attendees.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Cancel RSVP failed" });
    }

}