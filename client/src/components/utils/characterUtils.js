export const calculateBonus = (stat) => {
    return Math.floor((stat - 10) / 2);
};

export const calculateSavingThrow = (stat, characterClass, stats, classBaseST) => {
    const baseST = classBaseST[characterClass]?.[stat] || 0;
    return baseST + calculateBonus(stats[stat]);
};

export const calculateHP = (constitution, characterClass, classBaseHP) => {
    const baseHP = classBaseHP[characterClass];
    return baseHP + Math.floor((constitution - 8) / 2);
};

export const calculateArmor = (dexterity, characterClass, classArmor) => {
    const baseArmor = classArmor[characterClass];
    return baseArmor + Math.floor((dexterity - 8) / 2);
};