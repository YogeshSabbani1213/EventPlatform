import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    
    logout(); 
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-wide flex-shrink-0">
              Event Platform
            </Link>
            {/* Desktop Home Link */}
            <div className="hidden md:flex ml-10 space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                Home
              </Link>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-300 text-sm">
                  Hello, <span className="font-semibold text-white capitalize">{user.username}</span>
                </span>

                <Link 
                  to="/create-event" 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm transition"
                >
                  Create Event
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium text-sm transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">Register</Link>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 pb-4 px-4 pt-2 shadow-inner">
            <div className="flex flex-col space-y-3">
                <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Home
                </Link>

                {user ? (
                    <>
                        <div className="text-gray-300 px-3 py-2 text-base">
                            Logged in as: <span className="text-white font-bold capitalize">{user.username}</span>
                        </div>
                        <Link 
                            to="/create-event" 
                            onClick={() => setIsOpen(false)} 
                            className="bg-green-600 text-white block px-3 py-2 rounded-md text-base font-medium text-center"
                        >
                            Create Event
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="bg-red-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium text-center"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</Link>
                        <Link to="/register" onClick={() => setIsOpen(false)} className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium text-center">Register</Link>
                    </>
                )}
            </div>
        </div>
      )}
    </nav>
  );
}