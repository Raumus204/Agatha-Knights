import { Router } from 'express';
import userRoutes from './UserRoutes.js';
import characterRoutes from './CharacterRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/characters', characterRoutes);

export default router;