import express from 'express';
import { getLoanRecommendations, getLastUserAnalysis } from '../controllers/recommendController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/recommend - run a new analysis (requires auth)
router.post('/', authMiddleware, getLoanRecommendations);

// GET /api/recommend/last - fetch the latest saved analysis for the current user
router.get('/last', authMiddleware, getLastUserAnalysis);

export default router;