import React from 'react';

export function Goblin() {
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

    return (
        <div className="">
            <h4>{goblinStats.name}</h4>
            <p>HP: {calculateHP(goblinStats.constitution)}</p>
            <p>Armor Class: {calculateArmor(goblinStats.dexterity)}</p>
            <p>Initiative: {calculateInitiative(goblinStats.dexterity)}</p>
            <p>Attack: {goblinAttacks[0].damage} + {calculateBonus(goblinStats.strength)}</p>
        </div>
    );
}

export function Skeleton() {
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

    return (
        <div className="">
            <h4>{skeletonStats.name}</h4>
            <p>HP: {calculateHP(skeletonStats.constitution)}</p>
            <p>Armor Class: {calculateArmor(skeletonStats.dexterity)}</p>
            <p>Initiative: {calculateInitiative(skeletonStats.dexterity)}</p>
            <p>Attack: {skeletonAttacks[0].damage} + {calculateBonus(skeletonStats.strength)}</p>
        </div>
    );
}

export function Scorpian() {
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


    const skeletonAttacks = [
        {
            name: 'Stinger',
            attack: 7,
            damage: 7,
        },
    ];

    return (
        <div className="">
            <h4>{scorpianStats.name}</h4>
            <p>HP: {calculateHP(scorpianStats.constitution)}</p>
            <p>Armor Class: {calculateArmor(scorpianStats.dexterity)}</p>
            <p>Initiative: {calculateInitiative(scorpianStats.dexterity)}</p>
            <p>Attack: {skeletonAttacks[0].damage} + {calculateBonus(scorpianStats.strength)}</p>
        </div>
    );
}