import express from 'express';
import { getLoanRecommendations } from '../controllers/recommendController.js';

const router = express.Router();

// POST /api/recommend
router.post('/', getLoanRecommendations);

export default router;