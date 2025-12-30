import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export  function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    capacity: "",
  });
  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch existing event to pre-fill the form
    apiRequest(`/events/${id}`)
      .then((data) => {
        
        
        //  handling both 'id' and '_id' and mismatched types
        const currentUserId = user?.id || user?._id;
        const creatorId = data.createdBy?._id || data.createdBy;

        // If user exists AND IDs don't match, redirect
        if (user && currentUserId && creatorId && (currentUserId.toString() !== creatorId.toString())) {
            alert("You are not authorized to edit this event.");
            navigate("/");
            return;
        }
        

    
        try {
            const dateObj = new Date(data.dateTime);
           
            const formattedDate = dateObj.toISOString().slice(0, 16);
            
            setFormData({
              title: data.title,
              description: data.description,
              dateTime: formattedDate,
              location: data.location,
              capacity: data.capacity,
            });
            setCurrentImage(data.image);
        } catch (e) {
            console.error("Date parsing error", e);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load event data");
      });
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("dateTime", formData.dateTime);
    data.append("location", formData.location);
    data.append("capacity", formData.capacity);
    if (newImage) {
      data.append("image", newImage);
    }

    try {
      // apiRequest handles FormData headers automatically
      await apiRequest(`/events/${id}`, "PUT", data, user.token);
      alert("Event updated successfully!");
      navigate(`/events/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="Event Title" 
            className="border p-2 rounded focus:outline-blue-500" 
            required 
        />
        
        <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Description" 
            className="border p-2 rounded h-32 focus:outline-blue-500" 
            required 
        />
        
        <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Date & Time</label>
            <input 
                type="datetime-local" 
                name="dateTime" 
                value={formData.dateTime} 
                onChange={handleChange} 
                className="border p-2 rounded focus:outline-blue-500" 
                required 
            />
        </div>
        
        <input 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            placeholder="Location" 
            className="border p-2 rounded focus:outline-blue-500" 
            required 
        />
        
        <input 
            type="number" 
            name="capacity" 
            value={formData.capacity} 
            onChange={handleChange} 
            placeholder="Capacity" 
            className="border p-2 rounded focus:outline-blue-500" 
            required 
        />

        <div>
            <p className="text-sm text-gray-500 mb-2">Current Image:</p>
            {currentImage && (
                <img src={currentImage} alt="Current" className="h-24 w-full object-cover mb-3 rounded border" />
            )}
            <label className="block text-sm text-gray-600 mb-1">Upload New Image (Optional)</label>
            <input 
                type="file" 
                onChange={handleImageChange} 
                className="border p-2 rounded w-full bg-gray-50" 
            />
        </div>

        <div className="flex gap-3 mt-4">
            <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
                {loading ? "Updating..." : "Save Changes"}
            </button>
            <button 
                type="button" 
                onClick={() => navigate(`/events/${id}`)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
                Cancel
            </button>
        </div>
      </form>
    </div>
  );
}