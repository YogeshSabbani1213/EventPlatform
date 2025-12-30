
import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from '../controllers/eventController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.post('/',protect,upload.single('image'), createEvent);
router.get('/',getAllEvents);
router.get('/:id',getEventById);

router.delete('/:id',protect,deleteEvent)
router.put('/:id',protect,upload.single('image'),updateEvent);


export default router;