Here is a professional, ready-to-use **README.md** file for your project. You can create a file named `README.md` in the root of your GitHub repository and paste this content directly.

---

# Mini Event Platform - MERN Stack

A full-stack web application that allows users to create, view, and RSVP to events. Built as a technical assessment for the Full Stack Developer Intern role, this project demonstrates proficiency in the MERN stack (MongoDB, Express, React, Node.js), secure authentication, and handling concurrency in booking systems.

**Deployed Application:** [INSERT YOUR RENDER/VERCEL LINK HERE]

---

## 🚀 Features Implemented

### 1. User Authentication & Security

* **Sign Up & Login:** Secure user registration and authentication using **JWT (JSON Web Tokens)**.
* **Password Hashing:** Passwords are hashed using `bcryptjs` before storage.
* **Protected Routes:** Backend middleware (`protect`) ensures only authenticated users can create events or RSVP.

### 2. Event Management (CRUD)

* **Create Events:** Authenticated users can create events with title, description, date/time, location, capacity, and an image upload.
* **View Events:** A responsive dashboard displays all upcoming events.
* **Edit & Delete:** Users can only modify or delete events **they personally created**.
* **Image Handling:** File uploads are handled using **Multer**.

### 3. RSVP System (Core Business Logic)

* **Join/Leave Events:** Users can RSVP to events or cancel their attendance.
* **Capacity Enforcement:** The system strictly prevents more users from joining than the defined `capacity`.
* **Concurrency Handling:** Robust backend logic prevents "overbooking" race conditions.

### 4. Advanced Features (Bonus)


* **Responsive UI:** Fully responsive design with a mobile-friendly hamburger menu.
* **Personalized Greeting:** Header displays "Hello, [Username]" when logged in.

---

## 🛠️ Technical Explanation: RSVP Concurrency & Capacity

One of the critical challenges in this application was handling **Race Conditions** where multiple users might try to RSVP for the last available spot simultaneously.

### The Problem

If we use a simple "Read-Modify-Write" approach:

1. User A reads the event (Capacity: 10, Attendees: 9).
2. User B reads the event (Capacity: 10, Attendees: 9).
3. User A pushes their ID and saves (Attendees: 10).
4. User B pushes their ID and saves (Attendees: 11) -> **Overbooked!**

### The Solution: Atomic Updates

To solve this, I utilized MongoDB's **Atomic Operators**. Instead of fetching the document and updating it in JavaScript, the update condition is pushed directly to the database engine.

**Strategy Used:**
I perform the check and the update in a **single atomic operation**. The database query filters for the event **AND** checks if the current attendee count is less than the capacity.

```javascript
// Pseudo-code example of the logic used
const event = await Event.findOneAndUpdate(
  { 
    _id: eventId, 
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] } // Condition: Attendees < Capacity
  },
  { $push: { attendees: userId } }, // Action: Add User
  { new: true }
);

if (!event) {
  throw new Error("Event is full or does not exist");
}

```

By adding the capacity check strictly into the query filter, MongoDB locks the document during the write operation. If two users try to claim the last spot, the first one succeeds, and the second one matches **zero documents** (because the condition `attendees < capacity` is no longer true), preventing the overbooking.

---

## 💻 Instructions to Run Locally

Follow these steps to set up and run the project on your local machine.

### Prerequisites

* Node.js & npm installed.
* MongoDB installed locally or a MongoDB Atlas connection string.

### 1. Clone the Repository

```bash
git clone https://github.com/YogeshSabbani1213/EventPlatform.git
cd EVENT PLATFORM

```

### 2. Backend Setup

1. Navigate to the server folder:
```bash
cd server

```


2. Install dependencies:
```bash
npm install

```


3. Create a `.env` file in the `server` folder and add the following:
```env
PORT=5005
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

```


4. Start the server:
```bash
npm start

```


*(Server will run on http://localhost:5005)*

### 3. Frontend Setup

1. Open a new terminal and navigate to the client folder:
```bash
cd client

```


2. Install dependencies:
```bash
npm install

```


3. Start the React app:
```bash
npm run dev

```


*(Client will run on http://localhost:5173)*

### 4. Verify

Open your browser to `http://localhost:5173` to use the application.

---

## 📂 Project Structure

```
/
├── client/           # React Frontend
│   ├── src/
│   │   ├── components/  # Navbar, etc.
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Home, EventDetails, CreateEvent...
│   │   └── services/    # API requests
│
├── server/           # Node/Express Backend
│   ├── config/       # DB connection, Multer
│   ├── controllers/  # Logic for Events & Auth
│   ├── middleware/   # Auth Protection
│   ├── models/       # Mongoose Schemas
│   └── routes/       # API Routes
└── README.md

```

Created By:YogeshSabbani