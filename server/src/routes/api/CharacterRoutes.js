
import { Router } from 'express';
import { saveCharacter, getCharacter } from '../../controllers/CharacterController.js';

const router = Router();

router.post('/save', saveCharacter);
router.get('/:userId', getCharacter);

export default router;