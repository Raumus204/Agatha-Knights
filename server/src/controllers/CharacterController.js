import User from '../models/User.js';

// Save character information
export const saveCharacter = async (req, res) => {
    try {
        const { userId, name, class: characterClass, classImage, stats, classCharacter } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.character = { name, class: characterClass, classImage, stats, classCharacter};
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