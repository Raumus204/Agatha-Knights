import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Goblin, Skeleton, Scorpion } from '../Adversary';
import { calculateHP, calculateBonus } from '../utils/characterUtils';
import { classBaseHP, weaponDamage } from '../utils/characterConstants'; 
import { savePotionUses, saveTempHP, saveGold } from '../utils/characterSaves';
import './styles/War.css';
import HPBar from '../HPBar';


const rollD20 = () => Math.floor(Math.random() * 20) + 1;

export default function War() {
    const [character, setCharacter] = useState(null); // Initialize character state
    const [classCharacter, setClassCharacter] = useState(''); // Initialize character's class img state
    const [error, setError] = useState(false); // State for if error occurs
    const [adversary, setAdversary] = useState(null); // State for adversary component
    const [adversaryName, setAdversaryName] = useState(''); // State for adversary name
    const [adversaryStats, setAdversaryStats] = useState(null); // State for adversary stats
    const [adversaryArmorClass, setAdversaryArmorClass] = useState(0); // State for adversary armor class
    const [tempHP, setTempHP] = useState(0); // Initialize HP state for character
    const [potionUses, setPotionUses] = useState(3); // Initialize potion uses to 3 may change later to start with 0
    const [,setGold] = useState(0); // Initialize gold state
    const [showLoot, setShowLoot] = useState(false); // State to show loot
    const [lootCollected, setLootCollected] = useState(false); // State to track if loot has been collected
    const [attackMessage, setAttackMessage] = useState(''); // State for attack message
    const [attackHit, setAttackHit] = useState(false); // State to track if the attack hit
    const [criticalHit, setCriticalHit] = useState(false); // State to track if the roll was a critical hit
    const [adversaryHP, setAdversaryHP] = useState(0); // Initialize HP state for adversary
    const [adversaryMaxHP, setAdversaryMaxHP] = useState(0); // Initialize adversary max HP state
    const [adversaryAttack, setAdversaryAttack] = useState(() => {}); // Initialize adversary attack function
    const [selectedWeapon, setSelectedWeapon] = useState(''); // Add state for selected weapon
    const [isAttackDisabled, setIsAttackDisabled] = useState(false); // State to manage attack button disabled state
    const [enteredCatacombs, setEnteredCatacombs] = useState(false); // State to track if the user has entered the catacombs
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const calculateInitiative = (dexterity) => {
        return -1 + Math.floor((dexterity - 8) / 2);
    };

    // Function to reset Character HP and Adversary HP  // eventually want to reset money and items
    const resetTempHP = () => {
        const initialHP = calculateHP(character.stats.constitution, character.class, classBaseHP);
        setTempHP(initialHP);
        setAdversaryHP(adversaryMaxHP); // Reset adversary HP to max HP
        setIsAttackDisabled(false); // Re-enable the attack button
        setAttackMessage(''); // Clear the attack message
    };

    const getPotionImage = () => {
        switch (potionUses) { // Shows the correct potion image based on the number of uses left
            case 3:
                return '/HP-potions4.png';
            case 2:
                return '/HP-potions3.png';
            case 1:
                return '/HP-potions2.png';
            case 0:
            default:
                return '/HP-potions1.png';
        }
    };

    const handleUsePotion = async () => {
        if (potionUses > 0) {
            setTempHP((prevHP) => {
                const newHP = Math.min(prevHP + (Math.floor(Math.random() * 4) + 2) + 2, hp); // Increase HP by a 2d4 + 2 roll, but don't exceed max HP
                saveTempHP(auth.user._id, newHP); // Save tempHP to MongoDB
                return newHP;
            });
            setPotionUses((prevUses) => {
                const newPotionUses = Math.max(prevUses - 1, 0); // Ensure potionUses does not go below 0
                savePotionUses(auth.user._id, newPotionUses); // Save potion uses to MongoDB
                return newPotionUses;
            });
        }
    };

    const handleLoot = async () => {
        let goldReward = character.gold; // Fetch the current gold from character state
        if (adversaryName === 'Goblin') {
            goldReward += 5;
        } else if (adversaryName === 'Skeleton') {
            goldReward += 4;
        } else if (adversaryName === 'Scorpion') {
            goldReward += 3;
        }
        setGold(goldReward);
        await saveGold(auth.user._id, goldReward); // Save gold to MongoDB
        setCharacter((prevCharacter) => ({
            ...prevCharacter,
            gold: goldReward,
        })); // Update the character state with the new gold amount
        setShowLoot(false); // Hide the loot container after looting
        setLootCollected(true); // Mark loot as collected
    };

    // Enemy Attack Function
    const handleAdversaryAttack = (damage, name, roll) => {
        if (!character) {
            console.error('Character is not set.');
            return;
        }
        const characterArmorClass = character.attributes.armor;
        setCriticalHit(roll === 20); // Set critical hit state
    
        if (roll === 20) {
            damage *= 2; // Double the damage if it's a critical hit
            console.log(`${name} Roll to hit: ${roll}`);
            console.log(`${name} Critical Damage Roll: ${damage}`);
        }
    
        if (roll >= characterArmorClass) {
            setAttackHit(true);
            console.log(`${name} Roll to hit: ${roll}`);
            console.log(`${name} Damage Roll: ${damage}`);
            setAttackMessage(`${name} hits for ${damage} damage!`);
            setTempHP((prevHP) => {
                const newHP = Math.max(prevHP - damage, 0);
                saveTempHP(auth.user._id, newHP); // Save tempHP to MongoDB
                if (newHP === 0) {
                    setTimeout(() => {
                        setAttackMessage('Game Over!');
                    }, 2000);
                }
                return newHP;
            });
        } else {
            setAttackHit(false);
            console.log(`${name} Roll to hit: ${roll}`);
            setAttackMessage(`${name} misses the attack!`);
        }
    };

    // Character Attack Function
    const handleCharacterAttack = () => {
        if (!adversaryStats) {
            console.error('Adversary stats are not set.');
            return;
        }
    
        setIsAttackDisabled(true); // Disable the attack button
    
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
    
        const adversaryArmorClass = adversaryStats.armorClass;
    
        if (roll === 20) {
            // Log the values to verify the dice roll
            console.log(`Selected Weapon: ${selectedWeapon}`);
            console.log(`Roll to hit: ${roll} `);
            console.log('Bonus to hit:', calculateBonus(calculateBonusPerCharacter()));
            console.log(`Total Hit Roll: ${attackRoll}`); // Log the total attack roll
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
    
            // Console.logging stops here 
            const criticalDamage = totalDamage * 2;
            setAttackMessage(`${character.name} Critical Hits for ${criticalDamage} damage!`);
            setAdversaryHP((prevHP) => {
                const newHP = Math.max(prevHP - criticalDamage, 0);
                setTimeout(async () => {
                    if (newHP > 0) {
                        adversaryAttack();
                    } else {
                        setAttackMessage(`${adversaryName} has been slain!`);
                        setShowLoot(true); // Show the loot button
                        // let goldReward = character.gold; // Fetch the current gold from character state
                        // if (adversaryName === 'Goblin') {
                        //     goldReward += 2;
                        // } else if (adversaryName === 'Skeleton') {
                        //     goldReward += 5;
                        // } else if (adversaryName === 'Scorpion') {
                        //     goldReward += 3;
                        // }
                        // setGold(goldReward);
                        // await saveGold(auth.user._id, goldReward); // Save gold to MongoDB
                    }
                    setIsAttackDisabled(false); // Re-enable the attack button
                }, 2300);
                return newHP;
            });
            setCriticalHit(true);
            setAttackHit(true);
        } else if (attackRoll >= adversaryArmorClass) {
            // Log the values to verify the dice roll
            console.log(`Selected Weapon: ${selectedWeapon}`);
            console.log(`Roll to hit: ${roll} `);
            console.log('Bonus to hit:', calculateBonus(calculateBonusPerCharacter()));
            console.log(`Total Hit Roll: ${attackRoll}`); // Log the total attack roll
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
    
            // Console.logging stops here 
            setAttackMessage(`${character.name} hits for ${totalDamage} damage!`);
            setAdversaryHP((prevHP) => {
                const newHP = Math.max(prevHP - totalDamage, 0);
                setTimeout(async () => {
                    if (newHP > 0) {
                        adversaryAttack();
                    } else {
                        setAttackMessage(`${adversaryName} has been slain!`);
                        // let goldReward = character.gold; // Fetch the current gold from character state
                        // if (adversaryName === 'Goblin') {
                        //     goldReward += 2;
                        // } else if (adversaryName === 'Skeleton') {
                        //     goldReward += 5;
                        // } else if (adversaryName === 'Scorpion') {
                        //     goldReward += 3;
                        // }
                        // const newGold = goldReward;
                        // setGold(newGold);
                        // await saveGold(auth.user._id, newGold); // Save gold to MongoDB
                    }
                    setIsAttackDisabled(false); // Re-enable the attack button
                }, 2300);
                return newHP;
            });
            setAttackHit(true);
            setCriticalHit(false);
        } else if (roll === 1) {
            console.log(`Roll to hit: ${roll} `);
            console.log('Bonus to hit: Critical Miss');
            console.log(`Total Hit Roll: ${attackRoll}`); // Log the total attack roll
    
            setAttackMessage(`${character.name} misses the attack!`);
            setTimeout(() => {
                if (adversaryHP > 0) {
                    adversaryAttack();
                } else {
                    setAttackMessage(`${adversaryName} has been slain!`);
                }
                setIsAttackDisabled(false); // Re-enable the attack button
            }, 2300);
            setAttackHit(false);
            setCriticalHit(false);
        } else {
            console.log(`Roll to hit: ${roll} `);
            console.log('Bonus to hit:', calculateBonus(calculateBonusPerCharacter()));
            console.log(`Total Hit Roll: ${attackRoll}`); // Log the total attack roll
    
            setAttackMessage(`${character.name} misses the attack!`);
            setTimeout(() => {
                if (adversaryHP > 0) {
                    adversaryAttack();
                } else {
                    setAttackMessage(`${adversaryName} has been slain!`);
                }
                setIsAttackDisabled(false); // Re-enable the attack button
            }, 2300);
            setAttackHit(false);
            setCriticalHit(false);
        }
    };

    // Function to have random enemy appear
    const selectRandomAdversary = (armorClass, character) => {
        const adversaries = [
            { 
                component: <Goblin characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Goblin', roll)} />, 
                name: 'Goblin', 
                hp: 6,  // Manually set stats for each adversary
                armorClass: 6, 
                initiative: 3, 
                attack: () => {
                    const roll = rollD20();
                    const damage = Math.floor(Math.random() * 4) + 1; // Roll 1d4 for damage
                    handleAdversaryAttack(damage, 'Goblin', roll);
                } 
            },
            { 
                component: <Skeleton characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Skeleton', roll)} />, 
                name: 'Skeleton', 
                hp: 10, 
                armorClass: 13, 
                initiative: 0, 
                attack: () => {
                    const roll = rollD20();
                    const damage = Math.floor(Math.random() * 6) + 1; // Roll 1d6 for damage
                    handleAdversaryAttack(damage, 'Skeleton', roll);
                }
            },
            { 
                component: <Scorpion characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Scorpion', roll)} />, 
                name: 'Scorpion', 
                hp: 8, 
                armorClass: 8, 
                initiative: 1, 
                attack: () => {
                    const roll = rollD20();
                    const damage = Math.floor(Math.random() * 6) + 1; // Roll 1d6 for damage
                    handleAdversaryAttack(damage, 'Scorpion', roll);
                }
            }
        ];
        const randomIndex = Math.floor(Math.random() * adversaries.length);
        const selectedAdversary = adversaries[randomIndex];
        setAdversaryName(selectedAdversary.name); // Set the adversary name
        setAdversaryStats({ hp: selectedAdversary.hp, armorClass: selectedAdversary.armorClass, initiative: selectedAdversary.initiative }); // Set the adversary stats
        setAdversaryMaxHP(selectedAdversary.hp); // Set the adversary max HP
        setAdversaryHP(selectedAdversary.hp); // Initialize adversary HP to max HP
        setAdversaryArmorClass(selectedAdversary.armorClass); // Set the adversary armor class
        setAdversaryAttack(() => selectedAdversary.attack); // Set the adversary attack function
        setEnteredCatacombs(true); // Set enteredCatacombs to true
        setLootCollected(false); // Reset lootCollected to false
    
        // Calculate initiative and determine who attacks first
        const characterInitiative = calculateInitiative(character.stats.dexterity);
        const adversaryInitiative = selectedAdversary.initiative; // change
        if (adversaryInitiative > characterInitiative) {
            setAttackMessage('You are ambushed!');
            setTimeout(() => {
                selectedAdversary.attack(); // Adversary attacks first
            }, 2500);
        }
    
        return selectedAdversary.component;
    };

    const getAdversaryImage = () => {
        if (adversary && adversary.type === Goblin) {
            return '/Goblin.png';
        } else if (adversary && adversary.type === Skeleton) {
            return '/Skeleton.png';
        } else if (adversary && adversary.type === Scorpion) {
            return '/Scorpion.png';
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
                    setCharacter(data.character);
                    setClassCharacter(data.character.classCharacter);
                    setTempHP(data.character.attributes.tempHP || calculateHP(data.character.stats.constitution, data.character.class, classBaseHP));
                    setPotionUses(data.character.potionUses); // Fetch potion uses from character
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
    const armorClass = character.attributes.armor;

    return (
        <div className="war-container background-image">
            {!enteredCatacombs ? (
                <div className="catacombs-container">
                    <button onClick={() => setAdversary(selectRandomAdversary(character.attributes.armor, character))}>
                        Enter the Catacombs
                    </button>
                    <img src="/catacombs.png" alt="Catacombs" className="catacombs-image" />
                </div>
            ) : (
                <>
                    <div className="character-info-container">
                        <h2>{character.name}</h2>
                        <p>HP: {tempHP}</p>
                        <p>Armor Class: {armorClass || 0}</p>
                        <p>Initiative: {character.attributes.initiative}</p>
                        <p>Attack {weaponDamage[selectedWeapon] || '1d4'}</p>
                        <p>Spell Power</p>
                        {tempHP > 0 ? (
                            <button onClick={handleCharacterAttack} disabled={isAttackDisabled}>Attack</button>
                        ) : (
                            <button onClick={resetTempHP}>Retry</button>
                        )}
                        <div className="potion-container">
                            <h5>Potions</h5>
                            <span>{potionUses} uses left</span>
                            <br />
                            <button onClick={handleUsePotion}>
                                <img src={getPotionImage()} alt="Potion" className="potion-image" />
                            </button>
                        </div>
                        <p>Gold: {character.gold}</p>
                    </div>
                    <div className="middle-content">
                        <div className="upper-container">
                        <button onClick={() => setAdversary(selectRandomAdversary(character.attributes.armor, character))}>
                            {adversaryHP > 0 ? 'Advance in the opposite direction!?' : 'Advance!'}
                        </button>
                        {adversaryHP <= 0 && (
                            <button onClick={() => navigate('/market')}>Return to Market?</button>
                        )}
                        </div>
                        <div className="middle-container">
                        <div className={`attack-message ${criticalHit ? 'critical' : attackHit ? 'hit' : 'miss'}`}>
                                <p>{attackMessage}</p>
                            </div>
                            <div className="battle-container">
                                <div className="character-section">
                                    <HPBar hp={tempHP} maxHp={hp} /> 
                                    <img src={tempHP > 0 ? classCharacter : '/RIP.png'} alt="Class Character" className="character-image" />
                                </div>
                                <h1></h1>
                                <div className="character-section">
                                    <HPBar hp={adversaryHP} maxHp={adversaryMaxHP} />
                                    <img src={adversaryHP > 0 ? getAdversaryImage() : '/RIP-Adversary.png'} alt="Adversary" className="adversary-image" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="enemy-info-container">
                        <h2>{adversaryName}</h2>
                        {adversaryStats && <p>HP: {adversaryHP}</p>}
                        {adversaryStats && <p>Armor Class: {adversaryArmorClass}</p>}
                        {adversaryStats && <p>Initiative: {adversaryStats.initiative}</p>}
                        {adversaryHP <= 0 && !lootCollected && (
                            <div className="loot-container">
                                <button onClick={() => setShowLoot(!showLoot)}>Loot</button>
                                {showLoot && (
                                    <div>
                                        {adversaryName === 'Goblin' && <p>5 Gold</p>}
                                        {adversaryName === 'Skeleton' && <p>4 Gold</p>}
                                        {adversaryName === 'Scorpion' && <p>3 Gold</p>}
                                        <button onClick={handleLoot}>Collect Loot</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}