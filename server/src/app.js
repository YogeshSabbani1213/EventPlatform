import express from 'express';
import authRoutes from '../src/routes/authRoutes.js';
import eventRoutes from '../src/routes/eventRoutes.js';
import rsvpRoutes from '../src/routes/rsvpRoutes.js';
const app = express();

import cors from "cors";

app.use(
  cors({
    origin:[
    "http://localhost:5173",
    "https://event-platform-chi-neon.vercel.app"
    ],
      
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());

app.get('/',(req,res)=>{
    res.send(' Root route ')
})

app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/events',rsvpRoutes);
app.use('/api/events/:id',eventRoutes);
export default app;