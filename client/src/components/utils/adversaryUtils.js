export const calculateAdversaryHP = (constitution) => {
    return 10 + Math.floor((constitution - 8) / 2);
};

export const calculateAdversaryArmor = (dexterity) => {
    return 10 + Math.floor((dexterity - 8) / 2);
};