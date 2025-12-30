import CreateEvent from "./pages/CreateEvent";
import Login from './pages/Login';
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import SignUp from './pages/SignUp';
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar";
import { EditEvent } from "./pages/EditEvent";

function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Events/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent/>
            </ProtectedRoute>
          }
          />
          <Route path="/edit/:id" element={<EditEvent/>}/>
          <Route path="/events/:id" element={<EventDetails/>}/>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
