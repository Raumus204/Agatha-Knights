import React from 'react';

export function Goblin({ characterArmorClass, onAttack }) {
    const calculateBonus = (stat) => {
        return Math.floor((stat - 10) / 2);
    };

    const calculateHP = (constitution) => {
        return 7 + Math.floor((constitution - 8) / 2);
    };

    const calculateArmor = (dexterity) => {
        return 9 + Math.floor((dexterity - 8) / 2);
    };

    const calculateInitiative = (dexterity) => {
        return -1 + Math.floor((dexterity - 8) / 2);
    };

    const goblinStats = {
        name: 'Goblin',
        strength: 4,
        dexterity: 4,
        constitution: 4,
        intelligence: 4,
        wisdom: 4,
        charisma: 4,
        xp: 10,
        gold: 5,
    };

    const goblinAttacks = [
        {
            name: 'Shortsword',
            attack: 4,
            damage: 4,
        },
    ];

    const rollD20 = () => {
        return Math.floor(Math.random() * 20) + 1;
    };

    const handleAttack = () => {
        const roll = rollD20();
        const attackRoll = roll + goblinAttacks[0].attack;
        if (attackRoll >= characterArmorClass) {
            const damage = goblinAttacks[0].damage + calculateBonus(goblinStats.strength);
            onAttack(damage, roll);
        } else if (roll === 20) {
            const damage = goblinAttacks[0].damage + calculateBonus(goblinStats.strength) * 2;
            onAttack(damage, roll);
        } else {
            onAttack(0, roll); // Missed attack
        }
    };

    return (
        <div className="">
            <h4>{goblinStats.name}</h4>
            <p>HP: {calculateHP(goblinStats.constitution)}</p>
            <p>Armor Class: {calculateArmor(goblinStats.dexterity)}</p>
            <p>Initiative: {calculateInitiative(goblinStats.dexterity)}</p>
            <p>Attack: {goblinAttacks[0].damage} + {calculateBonus(goblinStats.strength)}</p>
            <button onClick={handleAttack}>Attack</button>
        </div>
    );
}

export function Skeleton({ characterArmorClass, onAttack }) {
    const calculateBonus = (stat) => {
        return Math.floor((stat - 10) / 2);
    };

    const calculateHP = (constitution) => {
        return 7 + Math.floor((constitution - 8) / 2);
    };

    const calculateArmor = (dexterity) => {
        return 9 + Math.floor((dexterity - 8) / 2);
    };

    const calculateInitiative = (dexterity) => {
        return -1 + Math.floor((dexterity - 8) / 2);
    };

    const skeletonStats = {
        name: 'Skeleton',
        strength: 6,
        dexterity: 6,
        constitution: 6,
        intelligence: 6,
        wisdom: 6,
        charisma: 6,
        xp: 15,
        gold: 7,
    };

    const skeletonAttacks = [
        {
            name: 'Longsword',
            attack: 5,
            damage: 5,
        },
    ];

    const rollD20 = () => {
        return Math.floor(Math.random() * 20) + 1;
    };

    const handleAttack = () => {
        const roll = rollD20();
        const attackRoll = roll + skeletonAttacks[0].attack;
        if (attackRoll >= characterArmorClass) {
            const damage = skeletonAttacks[0].damage + calculateBonus(skeletonStats.strength);
            onAttack(damage, roll);
        } else if (roll === 20) {
            const damage = skeletonAttacks[0].damage + calculateBonus(skeletonStats.strength) * 2;
            onAttack(damage, roll);
        } else {
            onAttack(0, roll); // Missed attack
        }
    };

    return (
        <div className="">
            <h4>{skeletonStats.name}</h4>
            <p>HP: {calculateHP(skeletonStats.constitution)}</p>
            <p>Armor Class: {calculateArmor(skeletonStats.dexterity)}</p>
            <p>Initiative: {calculateInitiative(skeletonStats.dexterity)}</p>
            <p>Attack: {skeletonAttacks[0].damage} + {calculateBonus(skeletonStats.strength)}</p>
            <button onClick={handleAttack}>Attack</button>
        </div>
    );
}

export function Scorpian({ characterArmorClass, onAttack }) {
    const calculateBonus = (stat) => {
        return Math.floor((stat - 10) / 2);
    };

    const calculateHP = (constitution) => {
        return 10 + Math.floor((constitution - 8) / 2);
    };

    const calculateArmor = (dexterity) => {
        return 10 + Math.floor((dexterity - 8) / 2);
    };

    const calculateInitiative = (dexterity) => {
        return -1 + Math.floor((dexterity - 8) / 2);
    };

    const scorpianStats = {
        name: 'Scorpian',
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        xp: 25,
        gold: 10,
    };

    const scorpianAttacks = [
        {
            name: 'Stinger',
            attack: 7,
            damage: 7,
        },
    ];

    const rollD20 = () => {
        return Math.floor(Math.random() * 20) + 1;
    };

    const handleAttack = () => {
        const roll = rollD20();
        const attackRoll = roll + scorpianAttacks[0].attack;
        if (attackRoll >= characterArmorClass) {
            const damage = scorpianAttacks[0].damage + calculateBonus(scorpianStats.strength);
            onAttack(damage, roll);
        } else if (roll === 20) {
            const damage = scorpianAttacks[0].damage + calculateBonus(scorpianStats.strength) * 2;
            onAttack(damage, roll);
        } else {
            onAttack(0, roll); // Missed attack
        }
    };

    return (
        <div className="">
            <h4>{scorpianStats.name}</h4>
            <p>HP: {calculateHP(scorpianStats.constitution)}</p>
            <p>Armor Class: {calculateArmor(scorpianStats.dexterity)}</p>
            <p>Initiative: {calculateInitiative(scorpianStats.dexterity)}</p>
            <p>Attack: {scorpianAttacks[0].damage} + {calculateBonus(scorpianStats.strength)}</p>
            <button onClick={handleAttack}>Attack</button>
        </div>
    );
}