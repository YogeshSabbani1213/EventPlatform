import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Fetch events whenever search or filterDate changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Build the query string dynamically
        let query = "/events?";
        if (searchTerm) query += `search=${searchTerm}&`;
        if (filterDate) query += `date=${filterDate}&`;

        const data = await apiRequest(query);
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search (wait 500ms after typing stops to fetch)
    const timeoutId = setTimeout(() => {
        fetchEvents();
    }, 500);

    return () => clearTimeout(timeoutId);

  }, [searchTerm, filterDate]); // Dependencies

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        
        {/* Search & Filter Section */}
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="Search events..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded"
            />
            <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border p-2 rounded"
            />
            <button 
                onClick={() => {setSearchTerm(""); setFilterDate("");}}
                className="text-sm text-blue-600 underline"
            >
                Clear
            </button>
        </div>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 text-sm mb-2">
                    {new Date(event.dateTime).toLocaleString()}
                </p>
                <p className="text-gray-700 truncate mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                        {event.location}
                    </span>
                    <Link
                        to={`/events/${event._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        View Details
                    </Link>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && <p>No events found matching your criteria.</p>}
        </div>
      )}
    </div>
  );
}