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
// before changes here 
export const calculateArmor = (dexterity, characterClass, classArmor) => {
        const baseArmor = classArmor[characterClass];
        return baseArmor + Math.floor((dexterity - 8) / 2);
};


//Possible function for armor selection -- not implemented
// const [selectedArmor, setSelectedArmor] = useState(''); // State to manage Armor equiped
// export const calculateArmor = (dexterity, characterClass, classArmor, selectedArmor, armorValues) => {
//     if (selectedArmor) {
//         const baseArmor = armorValues[selectedArmor];
//         return baseArmor + Math.floor((dexterity - 8) / 2);
//     } else {
//         const baseArmor = classArmor[characterClass];
//         return baseArmor + Math.floor((dexterity - 8) / 2);
//     }
// };

// const armorSets = {
//     light: {
//         LightArmor1: 11,
//         LightArmor2: 14,
//         classes: ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Paladin', 'Ranger', 'Rogue', 'Warlock'],
//     },
//     medium: {
//         MediumArmor1: 13,
//         MediumArmor2: 17,
//         classes: ['Barbarian', 'Cleric', 'Druid', 'Fighter', 'Paladin', 'Ranger'],
//     },
//     heavy: {
//         HeavyArmor1: 16,
//         HeavyArmor2: 21,
//         classes: ['Fighter', 'Paladin'],
//     },
//     shield: {
//         ShieldArmor1: 2,
//         ShieldArmor2: 3,
//         classes: ['Barbarian', 'Cleric', 'Druid', 'Fighter', 'Paladin', 'Ranger'],
//     },
// };
// // Function to calculate armor class baseArmor(armor or base class) + dex modifier
// const calculateArmorClass = (desterity) => {
//     if (selectedArmor) {
//         const baseArmor = armorValues[selectedArmor];
//         return baseArmor + Math.floor((dexterity - 8) / 2);
//     } else {
//         const baseArmor = startingClassArmmor[characterClass];
//         return baseArmor + Math.floor((ddexterity - 8) / 2);
//     }
// }
// // Function to handle Armor Selection per class
// const handleArmorSelection = (armor, characterClass) => {
//     const armorType = armor.split(' ')[0].toLowerCase();
//     const allowedClasses = armorSets[armorType].classes;
//     if (allowedClasses.includes(characterClass)) {
//         setSelectedArmor(armor);
//     } else {
//         alert(`Your class (${characterClass}) cannot use ${armor}`);
//     }
// };

// // Armor List
// <h3>Select Armor</h3>
//     <ul className="armor-list">
//         <li onClick={() => setSelectedArmor('Light Armor 1')} className={selectedArmor === 'Light Armor 1' ? 'selected' : ''}>Light Armor 1 (11)</li>
//         <li onClick={() => setSelectedArmor('Light Armor 2')} className={selectedArmor === 'Light Armor 2' ? 'selected' : ''}>Light Armor 2 (14)</li>
//         <li onClick={() => setSelectedArmor('Medium Armor 1')} className={selectedArmor === 'Medium Armor 1' ? 'selected' : ''}>Medium Armor 1 (13)</li>
//         <li onClick={() => setSelectedArmor('Medium Armor 2')} className={selectedArmor === 'Medium Armor 2' ? 'selected' : ''}>Medium Armor 2 (17)</li>
//         <li onClick={() => setSelectedArmor('Heavy Armor 1')} className={selectedArmor === 'Heavy Armor 1' ? 'selected' : ''}>Heavy Armor 1 (16)</li>
//         <li onClick={() => setSelectedArmor('Heavy Armor 2')} className={selectedArmor === 'Heavy Armor 2' ? 'selected' : ''}>Heavy Armor 2 (21)</li>
//         <li onClick={() => setSelectedArmor('Shield 1')} className={selectedArmor === 'Shield 1' ? 'selected' : ''}>Shield 1 (2)</li>
//         <li onClick={() => setSelectedArmor('Shield 2')} className={selectedArmor === 'Shield 2' ? 'selected' : ''}>Shield 2 (3)</li>
//     </ul>