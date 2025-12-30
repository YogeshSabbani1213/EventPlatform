import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { apiRequest } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest(`/events/${id}`)
      .then(setEvent)
      .catch((err) => console.error("Error fetching event:", err));
  }, [id]);

  if (!event) {
    return <div className="text-center mt-10 text-xl">Loading event details...</div>;
  }

  // ---------------- HELPER FUNCTIONS ----------------

  // 1. Get User ID safely (Handles 'id' vs '_id')
  const getCurrentUserId = (u) => {
    if (!u) return null;
    return u.id || u._id; 
  };

  // 2. Get Creator ID safely (Handles populated object vs raw string)
  const getCreatorId = (creator) => {
    if (!creator) return null;
    return creator._id || creator; 
  };

  const currentUserId = getCurrentUserId(user);
  const creatorId = getCreatorId(event.createdBy);

  
  const isCreator = currentUserId && creatorId && (currentUserId.toString() === creatorId.toString());

  //  RSVP CHECK
  const isAttending = user && event.attendees?.some(
    (attendee) => {
        const attendeeId = attendee._id || attendee;
        return attendeeId?.toString() === currentUserId?.toString();
    }
  );

  // ---------------- EVENT ACTIONS ----------------

  const handleRsvp = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`/events/${id}/rsvp`, "POST", null, user.token);

      setEvent((prev) => ({
        ...prev,
        attendees: [...prev.attendees, currentUserId],
      }));

      alert(res.message || "RSVP successful");
    } catch (err) {
      alert("RSVP failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRsvp = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`/events/${id}/rsvp`, "DELETE", null, user.token);

      setEvent((prev) => ({
        ...prev,
        attendees: prev.attendees.filter((a) => {
            const aId = a._id || a;
            return aId.toString() !== currentUserId.toString();
        }),
      }));

      alert(res.message || "RSVP cancelled");
    } catch (err) {
      alert("Cancel RSVP failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await apiRequest(`/events/${id}`, "DELETE", null, user.token);
      alert("Event deleted successfully");
      navigate("/");
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <img
        src={event.image}
        className="w-full h-80 object-cover rounded-lg"
        alt={event.title}
      />

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mt-2 gap-4">
            <span className="flex items-center gap-1">
                📅 {new Date(event.dateTime).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
                📍 {event.location}
            </span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold border-b pb-2 mb-2">About this Event</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {event.description}
        </p>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg flex justify-between items-center">
        <div>
            <p className="text-sm text-gray-500">Organizer</p>
            <p className="font-medium">{event.createdBy?.username || "Unknown"}</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-gray-500">Capacity</p>
            <p className="font-medium">
                {event.attendees?.length} / {event.capacity} Attendees
            </p>
        </div>
      </div>

      {/*  BUTTONS LOGIC */}
      <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t">
        
        
        {isCreator ? (
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/edit/${event._id}`)}
              className="px-6 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
            >
              Update Event
            </button>

            <button
              onClick={handleDeleteEvent}
              className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            >
              Delete Event
            </button>
          </div>
        ) : (
          
          user && (
            <div>
              {!isAttending ? (
                <button
                  onClick={handleRsvp}
                  disabled={loading || event.attendees.length >= event.capacity}
                  className={`px-6 py-2 rounded text-white font-semibold transition ${
                      event.attendees.length >= event.capacity 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {event.attendees.length >= event.capacity ? "Full" : "RSVP Now"}
                </button>
              ) : (
                <button
                  onClick={handleCancelRsvp}
                  disabled={loading}
                  className="px-6 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white font-semibold transition"
                >
                  Cancel RSVP
                </button>
              )}
            </div>
          )
        )}

        {!user && (
            <p className="text-red-500 mt-2">Please <a href="/login" className="underline">login</a> to RSVP.</p>
        )}
      </div>
    </div>
  );
}