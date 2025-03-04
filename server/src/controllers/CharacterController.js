import User from '../models/User.js';

// Save character information
export const saveCharacter = async (req, res) => {
    try {
        const { userId, name, class: characterClass, classImage, stats, classCharacter, attributes, potionUses, gold, equipment, kings, knights } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.character = { name, class: characterClass, classImage, stats, classCharacter, attributes, potionUses, gold, equipment, kings, knights };
        await user.save();

        res.status(200).json({ message: 'Character saved successfully', character: user.character });
    } catch (err) {
        res.status(500).json({ message: 'Error saving character', error: err });
    }
};

// Get character information
export const getCharacter = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ character: user.character });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching character', error: err });
    }
};

// Update tempHP
export const updateTempHP = async (req, res) => {
    try {
        const { userId } = req.params;
        const { tempHP } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.character.attributes.tempHP = tempHP;
        await user.save();

        res.status(200).json({ message: 'tempHP updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating tempHP', error: err });
    }
};

// Update potion uses
export const updatePotionUses = async (req, res) => {
    try {
        const { userId } = req.params;
        const { potionUses } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.character.potionUses = potionUses;
        await user.save();

        res.status(200).json({ message: 'Potion uses updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating potion uses', error: err });
    }
};

// Update gooooldd
export const updateGold = async (req, res) => {
    try {
        const { userId } = req.params;
        const { gold } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.character.gold = gold;
        await user.save();

        res.status(200).json({ message: 'Gold updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating gold', error: err });
    }
};

// Update equipment
export const updateEquipment = async (req, res) => {
    try {
        const { userId } = req.params;
        const { weapon, armor, shield } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.character.equipment = { weapon, armor, shield };
        await user.save();

        res.status(200).json({ message: 'Equipment updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating equipment', error: err });
    }
};

// Update kings
export const updateKings = async (req, res) => {
    try {
        const { userId } = req.params;
        const { kings } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.character.kings = kings;
        await user.save();

        res.status(200).json({ message: 'Kings updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating kings', error: err });
    }
};

// Update knights
export const updateKnights = async (req, res) => {
    try {
        const { userId } = req.params;
        const { knights } = req.body;

        const user = await
        User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.character.knights = knights;
        await user.save();

        res.status(200).json({ message: 'Knights updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating knights', error: err });
    }
};