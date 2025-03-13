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

const saveLevel = async (userId, level) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/characters/${userId}/level`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level }),
        });
    } catch (error) {
        console.error('Error saving level:', error);
    }
};

const saveExp = async (userId, exp) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/characters/${userId}/exp`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exp }),
        });
    } catch (error) {
        console.error('Error saving exp:', error);
    }
};

const saveHealth = async (userId, health) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/characters/${userId}/health`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ health }),
        });
    } catch (error) {
        console.error('Error saving health:', error);
    }
};

export { saveTempHP, savePotionUses, saveGold, saveLevel, saveExp, saveHealth, saveKings, saveKnights };

