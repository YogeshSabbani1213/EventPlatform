import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import EventCard from "../components/EventCard";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiRequest("/events").then(setEvents);
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {events.map(ev => <EventCard key={ev._id} event={ev} />)}
    </div>
  );
}
