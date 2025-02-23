import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { calculateAdversaryHP, calculateAdversaryArmor } from '../utils/adversaryUtils';
import { calculateHP, calculateArmor, calculateBonus } from '../utils/characterUtils';
import { classBaseHP, classArmor, startingClassArmor, weaponDamage } from '../utils/characterConstants'; 
import './styles/War.css';
import HPBar from '../HPBar';

const rollD20 = () => Math.floor(Math.random() * 20) + 1;

const Goblin = () => {

    return (
        <div>
            <h4>Goblin</h4>
        </div>
    );
};

const Skeleton = () => {

    return (
        <div>
            <h4>Skeleton</h4>
        </div>
    );
};

const Scorpian = () => {

    return (
        <div>
            <h4>Scorpian</h4>
        </div>
    );
};

export default function War() {
    const [character, setCharacter] = useState(null); // Initialize character state
    const [classCharacter, setClassCharacter] = useState(''); // Initialize character's class img state
    const [error, setError] = useState(false); // State for if error occurs
    const [adversary, setAdversary] = useState(null); // State for adversary component
    const [adversaryName, setAdversaryName] = useState(''); // State for adversary name
    const [adversaryStats, setAdversaryStats] = useState(null); // State for adversary stats
    const [adversaryArmorClass, setAdversaryArmorClass] = useState(0); // State for adversary armor class
    const [tempHP, setTempHP] = useState(0); // Initialize tempHP state
    const [attackMessage, setAttackMessage] = useState(''); // State for attack message
    const [attackHit, setAttackHit] = useState(false); // State to track if the attack hit
    const [criticalHit, setCriticalHit] = useState(false); // State to track if the roll was a critical hit
    const [adversaryHP, setAdversaryHP] = useState(20); // Initialize adversary HP state
    const [adversaryMaxHP, setAdversaryMaxHP] = useState(20); // Initialize adversary max HP state
    const [adversaryAttack, setAdversaryAttack] = useState(() => {}); // Initialize adversary attack function
    const [selectedWeapon, setSelectedWeapon] = useState(''); // Add state for selected weapon
    const { auth } = useContext(AuthContext);

    const calculateInitiative = (dexterity) => {
        return -1 + Math.floor((dexterity - 8) / 2);
    };

    // Enemy Attack Function
    const handleAdversaryAttack = (damage, name, roll) => {
        setCriticalHit(roll === 20); // Set critical hit state
        if (damage > 0) {
            setAttackMessage(`${name} hits for ${damage} damage!`);
            setAttackHit(true);
            console.log(`${name} (Roll: ${roll})`);
        } else {
            setAttackMessage(`${name} misses the attack!`);
            setAttackHit(false);
            console.log(`${name} (Roll: ${roll})`);
        }
        setTempHP((prevHP) => Math.max(prevHP - damage, 0));
    };

    // Character Attack Function
    const handleCharacterAttack = () => {
        if (!adversaryStats) {
            console.error('Adversary stats are not set.');
            return;
        }

        const calculateBonusPerCharacter = () => {
            if (character.class === 'Paladin' || character.class === 'Fighter' || character.class === 'Barbarian') {
                return character.stats.strength;
            } else if (character.class === 'Rogue' || character.class === 'Ranger' || character.class === 'Monk') {
                return character.stats.dexterity;
            } else if (character.class === 'Cleric' || character.class === 'Druid' || character.class === 'Bard') {
                return character.stats.wisdom;
            } else if (character.class === 'Wizard') {
                return character.stats.intelligence;
            } else if (character.class === 'Sorcerer' || character.class === 'Warlock') {
                return character.stats.charisma;
            }
        };

        const roll = Math.floor(Math.random() * 20) + 1;
        const attackRoll = roll + calculateBonus(calculateBonusPerCharacter());
        const weaponDamageDice = weaponDamage[selectedWeapon] || '1d4'; // Default to 1d4 if no weapon selected
        const [numDice, diceType] = weaponDamageDice.split('d').map(Number);

        // Log the values to verify the dice roll
        console.log(`Selected Weapon: ${selectedWeapon}`);
        console.log(`Roll to hit: ${roll}`);
        console.log(`Weapon Damage Dice: ${weaponDamageDice}`);
        console.log(`Number of Dice: ${numDice}`);
        console.log(`Dice Type: d${diceType}`);

        // Calculate the dice roll damage and log each individual dice roll
        let diceRollDamage = 0;
        for (let i = 0; i < numDice; i++) {
            const diceRoll = Math.floor(Math.random() * diceType) + 1;
            console.log(`Dice Roll ${i + 1}: ${diceRoll}`);
            diceRollDamage += diceRoll;
        }

        // Log the total dice roll damage
        console.log(`Total Dice Roll Damage: ${diceRollDamage}`);

        // Calculate the total damage including the bonus
        const totalDamage = diceRollDamage + calculateBonus(calculateBonusPerCharacter());

        // Log the total calculated damage
        console.log(`Total Calculated Damage: ${totalDamage}`);

        const adversaryArmorClass = calculateAdversaryArmor(adversaryStats.dexterity);

        if (roll === 20) {
            const criticalDamage = totalDamage * 2;
            setAttackMessage(`Character Critical Hits for ${criticalDamage} damage!`);
            setAdversaryHP((prevHP) => {
                const newHP = Math.max(prevHP - criticalDamage, 0);
                setTimeout(() => {
                    if (newHP > 0) {
                        adversaryAttack();
                    } else {
                        setAttackMessage(`${adversaryName} has been slain!`);
                    }
                }, 2000);
                return newHP;
            });
            setCriticalHit(true);
            setAttackHit(true);
        } else if (attackRoll >= adversaryArmorClass) {
            setAttackMessage(`Character hits for ${totalDamage} damage!`);
            setAdversaryHP((prevHP) => {
                const newHP = Math.max(prevHP - totalDamage, 0);
                setTimeout(() => {
                    if (newHP > 0) {
                        adversaryAttack();
                    } else {
                        setAttackMessage(`${adversaryName} has been slain!`);
                    }
                }, 2000);
                return newHP;
            });
            setAttackHit(true);
            setCriticalHit(false);
        } else {
            setAttackMessage(`Character misses the attack!`);
            setTimeout(() => {
                if (adversaryHP > 0) {
                    adversaryAttack();
                } else {
                    setAttackMessage(`${adversaryName} has been slain!`);
                }
            }, 2000);
            setAttackHit(false);
            setCriticalHit(false);
        }
    };

    // Function to have random enemy appear
    const selectRandomAdversary = (armorClass) => {
        const adversaries = [
            { 
                component: <Goblin characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Goblin', roll)} />, 
                name: 'Goblin', 
                stats: { dexterity: 4, constitution: 4 }, 
                attack: () => {
                    const roll = Math.floor(Math.random() * 20) + 1;
                    const damage = Math.floor(Math.random() * 4) + 1; // Roll 1d4 for damage
                    handleAdversaryAttack(damage, 'Goblin', roll);
                } 
            },
            { 
                component: <Skeleton characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Skeleton', roll)} />, 
                name: 'Skeleton', 
                stats: { dexterity: 6, constitution: 6 }, 
                attack: () => handleAdversaryAttack(5, 'Skeleton', Math.floor(Math.random() * 20) + 1) 
            },
            { 
                component: <Scorpian characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Scorpian', roll)} />, 
                name: 'Scorpian', 
                stats: { dexterity: 8, constitution: 8 }, 
                attack: () => {
                    const roll = rollD20();
                    const damage = Math.floor(Math.random() * 7) + 1; // Roll 1d7 for damage
                    console.log(`Scorpian Damage: ${damage}`);
                    handleAdversaryAttack(damage, 'Scorpian', roll);
                }
            }
        ];
        const randomIndex = Math.floor(Math.random() * adversaries.length);
        const selectedAdversary = adversaries[randomIndex];
        setAdversaryName(selectedAdversary.name); // Set the adversary name
        setAdversaryStats(selectedAdversary.stats); // Set the adversary stats
        setAdversaryArmorClass(calculateAdversaryArmor(selectedAdversary.stats.dexterity)); // Set the adversary armor class
        const maxHP = calculateAdversaryHP(selectedAdversary.stats.constitution);
        setAdversaryMaxHP(maxHP); // Set the adversary max HP
        setAdversaryHP(maxHP); // Initialize adversary HP to max HP
        setAdversaryAttack(() => selectedAdversary.attack); // Set the adversary attack function
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
                    // console.log('Character data:', data.character); // Log character data
                    setCharacter(data.character);
                    setClassCharacter(data.character.classCharacter);
                    const armorClass = calculateArmor(data.character.stats.dexterity, data.character.class, startingClassArmor);
                    setAdversary(selectRandomAdversary(armorClass));
                    setTempHP(calculateHP(data.character.stats.constitution, data.character.class, classBaseHP));
                    const storedWeapon = localStorage.getItem('selectedWeapon'); // Retrieve selectedWeapon from local storage
                    setSelectedWeapon(storedWeapon); // Set selectedWeapon state to storedWeapon
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
        <div className="war-container background-image">
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
                <div className="battle-text"><h1>Test your might!</h1></div>
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
                <h2>{adversaryName}</h2>
                {adversaryStats && <p>HP: {adversaryHP}</p>}
                {adversaryStats && <p>Armor Class: {adversaryArmorClass}</p>}
                {adversaryStats && <p>Initiative: {calculateInitiative(adversaryStats.dexterity)}</p>}
                <button onClick={() => setAdversary(selectRandomAdversary(10))}>New Adversary</button>
            </div>
        </div>
    );
}