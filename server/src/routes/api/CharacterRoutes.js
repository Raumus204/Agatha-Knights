import { Router } from 'express';
import { saveCharacter, getCharacter, updateTempHP } from '../../controllers/CharacterController.js';

const router = Router();

router.post('/save', saveCharacter);
router.get('/:userId', getCharacter);
router.put('/:userId/tempHP', updateTempHP); // Route to update tempHP

export default router;