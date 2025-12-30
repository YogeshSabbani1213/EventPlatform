import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <div className="border rounded p-4">
      <img src={event.image} className="h-40 w-full object-cover"/>
      <h3 className="font-bold">{event.title}</h3>
      <Link to={`/events/${event._id}`} className="text-blue-600">View</Link>
    </div>
  );
}
