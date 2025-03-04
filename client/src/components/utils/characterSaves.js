const saveTempHP = async (userId, hp) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/characters/${userId}/tempHP`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tempHP: hp }),
        });
    } catch (error) {
        console.error('Error saving tempHP:', error);
    }
};

const savePotionUses = async (userId, potionUses) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/characters/${userId}/potionUses`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ potionUses }),
        });
    } catch (error) {
        console.error('Error saving potion uses:', error);
    }
};

const saveGold = async (userId, gold) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/characters/${userId}/gold`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gold }),
        });
    } catch (error) {
        console.error('Error saving gold:', error);
    }
};

const saveKings = async (userId, kings) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/characters/${userId}/kings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kings }),
        });
    } catch (error) {
        console.error('Error saving kings:', error);
    }
};

const saveKnights = async (userId, knights) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/characters/${userId}/knights`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ knights }),
        });
    } catch (error) {
        console.error('Error saving knights:', error);
    }
};

export { saveTempHP, savePotionUses, saveGold, saveKings, saveKnights };

