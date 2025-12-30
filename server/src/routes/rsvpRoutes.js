import express from 'express';
import { cancelRsvp, rsvpEvent } from '../controllers/rsvpController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/:id/rsvp',protect,rsvpEvent);
router.delete('/:id/rsvp',protect,cancelRsvp);
export default router;