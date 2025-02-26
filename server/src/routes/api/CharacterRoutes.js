import { Router } from 'express';
import { saveCharacter, getCharacter, updateTempHP, updatePotionUses, updateGold } from '../../controllers/CharacterController.js';

const router = Router();

router.post('/save', saveCharacter); // Route to save character information
router.get('/:userId', getCharacter); // Route to get character information
// /api/characters/:userId/tempHP
router.put('/:userId/tempHP', updateTempHP); // Route to update tempHP
// /api/characters/:userId/potionUses
router.put('/:userId/potionUses', updatePotionUses); // Route to update potion uses
// /api/characters/:userId/gold
router.put('/:userId/gold', updateGold); // Route to update gold

export default router;