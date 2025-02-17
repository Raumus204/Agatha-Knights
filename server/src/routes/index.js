import { Router } from 'express';
import apiRoutes from './api/index.js';
import userRoutes from './api/UserRoutes.js';
import characterRoutes from './api/CharacterRoutes.js';
const router = Router();

router.use('/api', apiRoutes);
router.use('/users', userRoutes);
router.use('/characters', characterRoutes);

export default router;
