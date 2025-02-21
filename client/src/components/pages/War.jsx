import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Skeleton, Goblin, Scorpian, } from '../Adversary';
import { calculateAdversaryHP, calculateAdversaryArmor } from '../utils/adversaryUtils';
import { calculateHP, calculateArmor, calculateBonus } from '../utils/characterUtils';
import { classBaseHP, classArmor, startingClassArmor } from '../utils/characterConstants'; // Import classArmor
import './styles/War.css';
import HPBar from '../HPBar';

export default function War() {
    const [character, setCharacter] = useState(null);
    const [classCharacter, setClassCharacter] = useState('');
    const [error, setError] = useState(false);
    const [adversary, setAdversary] = useState(null);
    const [adversaryName, setAdversaryName] = useState(''); // State for adversary name
    const [adversaryStats, setAdversaryStats] = useState(null); // State for adversary stats
    const [adversaryArmorClass, setAdversaryArmorClass] = useState(0); // State for adversary armor class
    const [tempHP, setTempHP] = useState(0); // Initialize tempHP state
    const [attackMessage, setAttackMessage] = useState(''); // State for attack message
    const [attackHit, setAttackHit] = useState(false); // State to track if the attack hit
    const [criticalHit, setCriticalHit] = useState(false); // State to track if the roll was a critical hit
    const [adversaryHP, setAdversaryHP] = useState(20); // Initialize adversary HP state
    const [adversaryMaxHP, setAdversaryMaxHP] = useState(20); // Initialize adversary max HP state
    const { auth } = useContext(AuthContext);

    const calculateInitiative = (dexterity) => {
        return -1 + Math.floor((dexterity - 8) / 2);
    };

    const handleAdversaryAttack = (damage, name, roll) => {
        console.log(`Adversary Name: ${name}`); // Log adversary name
        setCriticalHit(roll === 20); // Set critical hit state
        if (damage > 0) {
            setAttackMessage(`${name} hits for ${damage} damage! (Roll: ${roll})`);
            setAttackHit(true);
        } else {
            setAttackMessage(`${name} misses the attack! (Roll: ${roll})`);
            setAttackHit(false);
        }
        setTempHP((prevHP) => Math.max(prevHP - damage, 0));
    };

    const handleCharacterAttack = () => {
        if (!adversaryStats) {
            console.error('Adversary stats are not set.');
            return;
        }

        const roll = Math.floor(Math.random() * 20) + 1;
        const attackRoll = roll + calculateBonus(character.stats.dexterity); // Assuming strength is used for attack
        const damage = calculateBonus(character.stats.dexterity) + 5; // Assuming a base damage of 5
        const adversaryArmorClass = calculateAdversaryArmor(adversaryStats.dexterity); // Calculate adversary's armor class

        if (roll === 20) {
            const criticalDamage = damage * 2;
            setAttackMessage(`Character hits for ${criticalDamage} damage! (Critical Hit, Roll: ${roll})`);
            setAdversaryHP((prevHP) => Math.max(prevHP - criticalDamage, 0));
            setCriticalHit(true);
            setAttackHit(true);
        } else if (attackRoll >= adversaryArmorClass) {
            setAttackMessage(`Character hits for ${damage} damage! (Roll: ${roll})`);
            setAdversaryHP((prevHP) => Math.max(prevHP - damage, 0));
            setAttackHit(true);
            setCriticalHit(false);
        } else {
            setAttackMessage(`Character misses the attack! (Roll: ${roll})`);
            setAttackHit(false);
            setCriticalHit(false);
        }
    };

    const selectRandomAdversary = (armorClass) => {
        const adversaries = [
            { component: <Goblin characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Goblin', roll)} />, name: 'Goblin', stats: { dexterity: 4, constitution: 4 } },
            { component: <Skeleton characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Skeleton', roll)} />, name: 'Skeleton', stats: { dexterity: 6, constitution: 6 } },
            { component: <Scorpian characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Scorpian', roll)} />, name: 'Scorpian', stats: { dexterity: 10, constitution: 16 } }
        ];
        const randomIndex = Math.floor(Math.random() * adversaries.length);
        const selectedAdversary = adversaries[randomIndex];
        setAdversaryName(selectedAdversary.name); // Set the adversary name
        setAdversaryStats(selectedAdversary.stats); // Set the adversary stats
        setAdversaryArmorClass(calculateAdversaryArmor(selectedAdversary.stats.dexterity)); // Set the adversary armor class
        const maxHP = calculateAdversaryHP(selectedAdversary.stats.constitution);
        setAdversaryMaxHP(maxHP); // Set the adversary max HP
        setAdversaryHP(maxHP); // Initialize adversary HP to max HP
        return selectedAdversary.component;
    };

    const getAdversaryImage = () => {
        if (adversary && adversary.type === Goblin) {
            return '/Goblin.png';
        } else if (adversary && adversary.type === Skeleton) {
            return '/Skeleton.png';
        } else if (adversary && adversary.type === Scorpian) {
            return '/scorpian.png';
        }
        return '';
    };

    useEffect(() => {
        const fetchCharacter = async () => {
            if (!auth.isAuthenticated) {
                setError(true);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/characters/${auth.user._id}`);
                const data = await response.json();
                if (response.ok) {
                    console.log('Character data:', data.character); // Log character data
                    setCharacter(data.character);
                    setClassCharacter(data.character.classCharacter);
                    const armorClass = calculateArmor(data.character.stats.dexterity, data.character.class, startingClassArmor);
                    setAdversary(selectRandomAdversary(armorClass));
                    setTempHP(calculateHP(data.character.stats.constitution, data.character.class, classBaseHP));
                } else {
                    setError(true);
                    console.error('Error fetching character:', data.message);
                }
            } catch (error) {
                setError(true);
                console.error('Error fetching character:', error);
            }
        };

        fetchCharacter();
    }, [auth.isAuthenticated, auth.user]);

    if (error || !character) {
        return (
            <div>
                <h1>War</h1>
                <p>No character found.</p>
                <Link to="/CreateCharacter">Create Character</Link>
            </div>
        );
    }

    const hp = calculateHP(character.stats.constitution, character.class, classBaseHP);
    const armorClass = calculateArmor(character.stats.dexterity, character.class, startingClassArmor);

    return (
        <div className="war-container">
            <div className="character-info-container">
                <h2>{character.name}</h2>
                <p>HP: {tempHP}</p>
                <p>Armor Class: {armorClass || 0}</p>
                <p>Initiative: {calculateInitiative(character.stats.dexterity)}</p>
                <p>Attack</p>
                <p>Spell Power</p>
                <button onClick={handleCharacterAttack}>Attack</button>
            </div>
            <div className="middle-container">
                <div className="battle-text"><h1>Welcome to the war page!</h1></div>
                <div className="battle-container">
                    <div className="character-section">
                        <HPBar hp={tempHP} maxHp={hp} /> 
                        <img src={tempHP > 0 ? classCharacter : '/RIP.png'} alt="Class Character" className="character-image" />
                    </div>
                    <h1>VS</h1>
                    <div className="character-section">
                    <HPBar hp={adversaryHP} maxHp={adversaryMaxHP} />
                    <img src={adversaryHP > 0 ? getAdversaryImage() : '/RIP-Adversary.png'} alt="Adversary" className="adversary-image" />
                    </div>
                </div>
                <div className={`attack-message ${criticalHit ? 'critical' : attackHit ? 'hit' : 'miss'}`}>
                <p>{attackMessage}</p>
            </div>
            </div>
            
            <div className="enemy-info-container">
                {adversary}
                {adversaryStats && <p>Adversary HP: {adversaryHP}</p>}
                {adversaryStats && <p>Adversary Armor Class: {calculateAdversaryArmor(adversaryStats.dexterity)}</p>}
            </div>
        </div>
    );
}