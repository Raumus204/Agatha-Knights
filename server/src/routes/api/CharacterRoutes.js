import { Router } from 'express';
import { saveCharacter, getCharacter, updateTempHP, updatePotionUses, updateGold, updateEquipment, updateKings, updateKnights, updateLevel, updateExp, updateHealth } from '../../controllers/CharacterController.js';

const router = Router();

router.post('/save', saveCharacter); // Route to save character information
router.get('/:userId', getCharacter); // Route to get character information
// /api/characters/:userId/tempHP
router.put('/:userId/tempHP', updateTempHP); // Route to update tempHP
// /api/characters/:userId/potionUses
router.put('/:userId/potionUses', updatePotionUses); // Route to update potion uses
// /api/characters/:userId/gold
router.put('/:userId/gold', updateGold); // Route to update gold
// /api/characters/:userId/equipment
router.put('/:userId/equipment', updateEquipment); // Route to update equipment
// api/character/:userId/kings
router.put('/:userId/kings', updateKings); // Route to update kings
// api/character/:userId/knights
router.put('/:userId/knights', updateKnights); // Route to update knights
// api/character/:userId/level
router.put('/:userId/level', updateLevel); // Route to update level
// api/character/:userId/exp
router.put('/:userId/exp', updateExp); // Route to update exp
// api/character/:userId/health
router.put('/:userId/health', updateHealth); // Route to update health


export default router;