import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { classArmorList, martialWeaponsList, simpleWeaponsList } from '../utils/characterConstants';
import './styles/CreateCharacter.css';

export default function CreateCharacter() {
    const [name, setName] = useState('');
    const [characterClass, setCharacterClass] = useState('');
    const [classImage, setClassImage] = useState('');
    const [classCharacter, setClassCharacter] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [stats, setStats] = useState({ strength: 8, dexterity: 8, intelligence: 8, constitution: 8, wisdom: 8, charisma: 8 });
    const [remainingPoints, setRemainingPoints] = useState(27);
    const [selectedPlusTwo, setSelectedPlusTwo] = useState('');
    const [selectedPlusOne, setSelectedPlusOne] = useState('');
    const [currentTab, setCurrentTab] = useState('class'); // State to manage the current tab
    const [spells, setSpells] = useState([]); // State to manage spells
    const [selectedWeapon, setSelectedWeapon] = useState(''); // State to manage selected weapon
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    // Paladin,  (CHA): 9 DC / +1 Spell Attack, armor x4, simple weapons x12, martial weapons x19, hp 9, armor class 9
    // Cleric, (WIS): 9 DC / +1 Spell Attack, armor x3, simple weapons x12, martial weapons x2, hp 7, armor class 9
    // Fighter, armor x4, simple weapons x12, martial weapons x19 hp 9, armor class 9
    // Barbarian, (CHA): 9 DC / +1 Spell Attack, armor x3, simple weapons x12, martial weapons x19, hp 11, armor class 8
    // Rogue, armor x1, simple weapons x12, martial weapons x4, hp 7, armor class 9
    // Ranger,  (WIS): 9 DC / +1 Spell Attack, armor x3, simple weapons x12, martial weapons x19,  hp 9, armor class 9
    // Druid, (WIS): 9 DC / +1 Spell Attack, armor x3, simple weapons x7, martial weapons x1, hp 7, armor class 9
    // Bard, (CHA): 9 DC / +1 Spell Attack, armor x1, simple weapons x12, martial weapons x4 hp 7, armor class 9
    // Monk,  (WIS): 9 DC / +1 Spell Attack, armor x0, simple weapons x12, martial weapons x1 hp 7, armor class 8
    // Wizard, INT 9 DC / +1 Spell Attack, simple weapon x3, martial weapon x0, hp 5, armor class 9
    // Sorcerer, (CHA): 9 DC / +1 Spell Attack, armor x0, simple weapons x3, martial weapons x0   hp 5, armor class 9
    // Warlock,(CHA): 9 DC / +1 Spell Attack, armor x1, simple weapons x12, martial weapons x0 hp 7, armor class 9

    const handleWeaponSelection = (weapon) => {
        // console.log(`Selected weapon: ${weapon}`); // Log the selected weapon
        setSelectedWeapon(weapon);
        localStorage.setItem('selectedWeapon', weapon); // Store selectedWeapon in local storage
    };
     
    const mWeaponsList = martialWeaponsList[characterClass] || []; 
    const sWeaponsList = simpleWeaponsList[characterClass] || [];
    const armorList = classArmorList[characterClass] || [];

    const classBaseHP = {
        Paladin: 9,
        Cleric: 7,
        Fighter: 9,
        Barbarian: 11,
        Rogue: 7,
        Ranger: 9,
        Druid: 7,
        Bard: 7,
        Monk: 7,
        Wizard: 5,
        Sorcerer: 5,
        Warlock: 7,
    };


    const startingClassArmor = {
        Paladin: 9,
        Cleric: 9,
        Fighter: 9,
        Barbarian: 8,
        Rogue: 9,
        Ranger: 9,
        Druid: 9,
        Bard: 9,
        Monk: 8,
        Wizard: 9,
        Sorcerer: 9,
        Warlock: 9
    }

    const classArmor = {
        Paladin: 4,
        Cleric: 3,
        Fighter: 4,
        Barbarian: 3,
        Rogue: 1,
        Ranger: 3,
        Druid: 3,
        Bard: 1,
        Monk: 0,
        Wizard: 0,
        Sorcerer: 0,
        Warlock: 1,
    }

    const classBaseST = {
        Paladin: {
            strength: 2,
            dexterity: 0,
            constitution: 0,
            intelligence: 2,
            wisdom: 0,
            charisma: 0
        },
        Cleric: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 2,
            charisma: 2
        },
        Fighter: {
            strength: 2,
            dexterity: 0,
            constitution: 2,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
        },
        Barbarian: {
            strength: 2,
            dexterity: 0,
            constitution: 2,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
        },
        Rogue: {
            strength: 0,
            dexterity: 2,
            constitution: 0,
            intelligence: 2,
            wisdom: 0,
            charisma: 0
        },
        Ranger: {
            strength: 2,
            dexterity: 2,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
        },
        Druid: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 2,
            wisdom: 2,
            charisma: 0
        },
        Bard: {
            strength: 0,
            dexterity: 2,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 2
        },
        Monk: {
            strength: 2,
            dexterity: 2,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
        },
        Wizard: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 2,
            wisdom: 2,
            charisma: 0
        },
        Sorcerer: {
            strength: 0,
            dexterity: 0,
            constitution: 2,
            intelligence: 0,
            wisdom: 0,
            charisma: 2
        },
        Warlock: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 2,
            charisma: 2
        },
    };

    const handleClassSelection = (characterClass, classImage) => {
        const classCharacterMap = {
            Paladin: '/Paladin-img.png',
            Cleric: '/Cleric-img.png',
            Fighter: '/Fighter-img.png',
            Barbarian: '/Barbarian-img.png',
            Rogue: '/Rogue-img.png',
            Ranger: '/Ranger-img.png',
            Druid: '/Druid-img.png',
            Bard: '/Bard-img.png',
            Monk: '/Cleric-img.png',
            Wizard: '/Wizard-img.png',
            Sorcerer: '/Sorcerer-img.png',
            Warlock: '/Warlock-img.png',
        };
        setCharacterClass(characterClass);
        setClassImage(classImage);
        setSelectedClass(characterClass);
        updateSpells(characterClass);
        setClassCharacter(classCharacterMap[characterClass]);
    };

    const updateSpells = (characterClass) => {
        const classSpells = {
            Paladin: ['Divine Smite', 'Lay on Hands', 'Aura of Protection'],
            Cleric: ['Turn Undead', 'Healing Word', 'Bless'],
            Fighter: ['Second Wind', 'Action Surge', 'Indomitable'],
            Barbarian: ['Rage', 'Reckless Attack', 'Danger Sense'],
            Rogue: ['Sneak Attack', 'Cunning Action', 'Evasion'],
            Ranger: ['Favored Enemy', 'Natural Explorer', 'Primeval Awareness'],
            Druid: ['Wild Shape', 'Druidic', 'Circle Spells'],
            Bard: ['Bardic Inspiration', 'Jack of All Trades', 'Song of Rest'],
            Monk: ['Unarmored Movement', 'Martial Arts', 'Ki'],
            Wizard: ['Spellbook', 'Arcane Recovery', 'Ritual Casting'],
            Sorcerer: ['Sorcerous Origin', 'Font of Magic', 'Metamagic'],
            Warlock: ['Pact Magic', 'Eldritch Invocations', 'Pact Boon'],
        };
        setSpells(classSpells[characterClass]);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/characters/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: auth.user._id, name, class: characterClass, classImage, stats, classCharacter }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                localStorage.setItem('selectedWeapon', selectedWeapon); // Store selectedWeapon in local storage
                navigate('/Character');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error saving character:', error);
            alert('Failed to save character.');
        }
    };
    // 15 = 18, 14=20, 13=22, 12=23 11=24, 10=25, 9=26, 8=27
    // 15 - 2 checkbox decreases stat value by 2 when it should be 1
    // 14 - 1 checkbox decreases stat value by 2 when it should be 1
    // 13 + 1 checkbox increases stat value by 2 when it should be 1
    // 12 + 1 checkbox increases stat value by 2 when it should be 1
    const increaseStat = (stat, increment) => {
        setStats((prevStats) => {
            const currentStatValue = prevStats[stat];
            // Enforces meximum stat values based on checkboxes
            const maxStatValue = selectedPlusTwo === stat ? 17 : (selectedPlusOne === stat ? 16 : 15);
            if (currentStatValue + increment > maxStatValue) return prevStats;

            // Adjust points used based on the current stat value
            let pointsUsed;
            // if +2 checkbox is selected and stat value is 13 or 14, points gained should be 1
            if (selectedPlusTwo === stat && (currentStatValue === 13 || currentStatValue === 14)) {
                pointsUsed = 1;
            // if +1 checkbox is selected and stat value is 13, points gained should be 1
            } else if (selectedPlusOne === stat && (currentStatValue === 13)) {
                pointsUsed = 1;
                // points gained is 2 if stat value is greater than 13, otherwise 1
            } else {
                pointsUsed = (currentStatValue >= 13) ? 2 * increment : increment;
            }
    
            if (remainingPoints - pointsUsed >= 0) {
                setRemainingPoints(remainingPoints - pointsUsed);
                return {
                    ...prevStats,
                    [stat]: currentStatValue + increment,
                };
            }
            return prevStats;
        });
    };

    const decreaseStat = (stat) => {
        setStats((prevStats) => {
            const currentStatValue = prevStats[stat];
            if (currentStatValue <= 8) return prevStats;
            // Enforces minimum stat values based on checkboxes +2 = 10, +1 = 9
            if (selectedPlusTwo === stat && currentStatValue <= 10) return prevStats;
            if (selectedPlusOne === stat && currentStatValue <= 9) return prevStats;

            // Adjust points used based on the current stat value
            let pointsUsed;
            // if +2 checkbox is selected and stat value is 15 or 14, points used should be 1
            if (selectedPlusTwo === stat && (currentStatValue === 15 || currentStatValue === 14)) {
                pointsUsed = 1;
            // if +1 checkbox is selected and stat value is 13 or 12, points used should be 1
            } else if (selectedPlusOne === stat && (currentStatValue === 14 || currentStatValue === 13)) {
                pointsUsed = 1;
            } else {
                // points used is 2 if stat value is greater than 13, otherwise 1
                pointsUsed = currentStatValue > 13 ? 2 : 1;
            }
            const newStatValue = currentStatValue - 1;
            
            setRemainingPoints(remainingPoints + pointsUsed);
            return {
                ...prevStats,
                [stat]: newStatValue,
            };
        });
    };

    const handleCheckboxChange = (stat, increment) => {
        if (increment === 2) {
            if (selectedPlusTwo === stat) {
                setSelectedPlusTwo('');
                setStats((prevStats) => ({
                    ...prevStats,
                    [stat]: prevStats[stat] - 2,
                }));
            } else {
                setSelectedPlusTwo(stat);
                setStats((prevStats) => ({
                    ...prevStats,
                    [stat]: prevStats[stat] + 2,
                }));
                if (selectedPlusOne === stat) {
                    setSelectedPlusOne('');
                    setStats((prevStats) => ({
                        ...prevStats,
                        [stat]: prevStats[stat] - 1,
                    }));
                }
            }
        } else if (increment === 1) {
            if (selectedPlusOne === stat) {
                setSelectedPlusOne('');
                setStats((prevStats) => ({
                    ...prevStats,
                    [stat]: prevStats[stat] - 1,
                }));
            } else {
                setSelectedPlusOne(stat);
                setStats((prevStats) => ({
                    ...prevStats,
                    [stat]: prevStats[stat] + 1,
                }));
                if (selectedPlusTwo === stat) {
                    setSelectedPlusTwo('');
                    setStats((prevStats) => ({
                        ...prevStats,
                        [stat]: prevStats[stat] - 2,
                    }));
                }
            }
        }
    };

    const calculateBonus = (stat) => {
        return Math.floor((stat - 10) / 2);
    };

    const calculateSavingThrow = (stat) => {
        const baseST = classBaseST[characterClass]?.[stat] || 0;
        return baseST + calculateBonus(stats[stat]);
    };

    const calculateHP = (constitution) => {
        const baseHP = classBaseHP[characterClass];
        return baseHP + Math.floor((constitution - 8) /2);
    };
    
    const calculateArmor = (dexterity) => {
        const baseArmor = startingClassArmor[characterClass];
        return baseArmor + Math.floor((dexterity - 8) / 2);
    }

    const resetStats = () => {
        setStats({ strength: 8, dexterity: 8, intelligence: 8, constitution: 8, wisdom: 8, charisma: 8 });
        setRemainingPoints(27);
        setSelectedPlusTwo('');
        setSelectedPlusOne('');
    };

    const recommendedStat = () => {
        if (characterClass === 'Paladin' || characterClass === 'Fighter' || characterClass === 'Barbarian') {
            return "Strength";
        } else if (characterClass === 'Rogue' || characterClass === 'Ranger' || characterClass === 'Monk') {
            return "Dexterity";
        } else if (characterClass === 'Cleric' || characterClass === 'Druid' || characterClass === 'Bard') {
            return "Wisdom";
        } else if (characterClass === 'Wizard') {
            return "Intelligence";
        } else if (characterClass === 'Sorcerer' || characterClass === 'Warlock') {
            return "Charisma";
        } else {
            return "";
        }
    };

    return (
        
        <div className="create-character-container">
            <div className="sidebar">
            <h2>Forge your Destiny</h2>
                <ul>
                    <li className={currentTab === 'class' ? 'active' : ''} onClick={() => setCurrentTab('class')}>Class</li>
                    <li className={currentTab === 'abilities' ? 'active' : ''} onClick={() => setCurrentTab('abilities')}>Abilities</li>
                    <li className={currentTab === 'spells' ? 'active' : ''} onClick={() => setCurrentTab('spells')}>Spells</li>
                    <li className={currentTab === 'items' ? 'active' : ''} onClick={() => setCurrentTab('items')}>Items/Misc</li>
                </ul>
            </div>
           
            <div className="content">
                {currentTab === 'class' && (
                    <div>
                        <div className="name-container">
                            <h1>Who are you?</h1>
                            <label>
                                Name:
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </label>
                    </div>
                        <h2>What is your Profession?</h2>
                        <ul className="classes no-bullets">
                            <li onClick={() => handleClassSelection('Paladin', '/paladin.png')} className={selectedClass === 'Paladin' ? 'selected' : ''}><img src="/paladin.png" alt="Paladin" /></li>
                            <li onClick={() => handleClassSelection('Cleric', '/cleric.png')} className={selectedClass === 'Cleric' ? 'selected' : ''}><img src="/cleric.png" alt="Cleric" /></li> 
                            <li onClick={() => handleClassSelection('Fighter', '/fighter.png')} className={selectedClass === 'Fighter' ? 'selected' : ''}><img src="/fighter.png" alt="Fighter" /></li>
                            <li onClick={() => handleClassSelection('Barbarian', '/barbarian.png')} className={selectedClass === 'Barbarian' ? 'selected' : ''}><img src="/barbarian.png" alt="Barbarian" /></li>
                            <li onClick={() => handleClassSelection('Rogue', '/rogue.png')} className={selectedClass === 'Rogue' ? 'selected' : ''}><img src="/rogue.png" alt="Rogue" /></li>
                            <li onClick={() => handleClassSelection('Ranger', '/ranger.png')} className={selectedClass === 'Ranger' ? 'selected' : ''}><img src="/ranger.png" alt="Ranger" /></li>
                            <li onClick={() => handleClassSelection('Druid', '/druid.png')} className={selectedClass === 'Druid' ? 'selected' : ''}><img src="/druid.png" alt="Druid" /></li>
                            <li onClick={() => handleClassSelection('Bard', '/bard.png')} className={selectedClass === 'Bard' ? 'selected' : ''}><img src="/bard.png" alt="Bard" /></li>
                            <li onClick={() => handleClassSelection('Monk', '/monk.png')} className={selectedClass === 'Monk' ? 'selected' : ''}><img src="/monk.png" alt="Monk" /></li>
                            <li onClick={() => handleClassSelection('Wizard', '/wizard.png')} className={selectedClass === 'Wizard' ? 'selected' : ''}><img src="/wizard.png" alt="Wizard" /></li>
                            <li onClick={() => handleClassSelection('Sorcerer', '/sorcerer.png')} className={selectedClass === 'Sorcerer' ? 'selected' : ''}><img src="/sorcerer.png" alt="Sorcerer" /></li>
                            <li onClick={() => handleClassSelection('Warlock', '/warlock.png')} className={selectedClass === 'Warlock' ? 'selected' : ''}><img src="/warlock.png" alt="Warlock" /></li>
                        </ul>
                        <div className="buttons-container">
                            <button type="submit" className="save-button" onClick={handleSubmit}>Save Character</button>
                        </div>
                    </div>
                )}
                {currentTab === 'abilities' && (
                    <div>
                        <h2>Where do your abilities align?</h2>
                        <p>Ability Points: {remainingPoints}</p>
                        <div className="stats-container">
                            <p>Strength
                                <button type="button" className="stats-buttons decrement" onClick={() => decreaseStat('strength')}>-</button>
                                {stats.strength} ({calculateBonus(stats.strength)})
                                <button type="button" className="stats-buttons increment" onClick={() => increaseStat('strength', 1)}>+</button>
                                <span className="checkbox-container">
                                    <input type="checkbox" checked={selectedPlusTwo === 'strength'} onChange={() => handleCheckboxChange('strength', 2)} /> +2
                                    <input type="checkbox" checked={selectedPlusOne === 'strength'} onChange={() => handleCheckboxChange('strength', 1)} /> +1
                                </span>
                            </p>
                            <p>Dexterity
                                <button type="button" className="stats-buttons decrement" onClick={() => decreaseStat('dexterity')}>-</button>
                                {stats.dexterity} ({calculateBonus(stats.dexterity)}) 
                                <button type="button" className="stats-buttons increment" onClick={() => increaseStat('dexterity', 1)}>+</button> 
                                <span className="checkbox-container">
                                    <input type="checkbox" checked={selectedPlusTwo === 'dexterity'} onChange={() => handleCheckboxChange('dexterity', 2)} /> +2
                                    <input type="checkbox" checked={selectedPlusOne === 'dexterity'} onChange={() => handleCheckboxChange('dexterity', 1)} /> +1
                                </span>
                            </p>
                            <p>Constitution
                                <button type="button" className="stats-buttons decrement" onClick={() => decreaseStat('constitution')}>-</button>
                                {stats.constitution} ({calculateBonus(stats.constitution)}) 
                                <button type="button" className="stats-buttons increment" onClick={() => increaseStat('constitution', 1)}>+</button> 
                                <span className="checkbox-container">
                                    <input type="checkbox" checked={selectedPlusTwo === 'constitution'} onChange={() => handleCheckboxChange('constitution', 2)} /> +2
                                    <input type="checkbox" checked={selectedPlusOne === 'constitution'} onChange={() => handleCheckboxChange('constitution', 1)} /> +1
                                </span>
                            </p>
                            <p>Intelligence
                                <button type="button" className="stats-buttons decrement" onClick={() => decreaseStat('intelligence')}>-</button>
                                {stats.intelligence} ({calculateBonus(stats.intelligence)}) 
                                <button type="button" className="stats-buttons increment" onClick={() => increaseStat('intelligence', 1)}>+</button> 
                                <span className="checkbox-container">
                                    <input type="checkbox" checked={selectedPlusTwo === 'intelligence'} onChange={() => handleCheckboxChange('intelligence', 2)} /> +2
                                    <input type="checkbox" checked={selectedPlusOne === 'intelligence'} onChange={() => handleCheckboxChange('intelligence', 1)} /> +1
                                </span>
                            </p>
                            <p>Wisdom
                                <button type="button" className="stats-buttons decrement" onClick={() => decreaseStat('wisdom')}>-</button>
                                {stats.wisdom} ({calculateBonus(stats.wisdom)}) 
                                <button type="button" className="stats-buttons increment" onClick={() => increaseStat('wisdom', 1)}>+</button> 
                                <span className="checkbox-container">
                                    <input type="checkbox" checked={selectedPlusTwo === 'wisdom'} onChange={() => handleCheckboxChange('wisdom', 2)} /> +2
                                    <input type="checkbox" checked={selectedPlusOne === 'wisdom'} onChange={() => handleCheckboxChange('wisdom', 1)} /> +1
                                </span>
                            </p>
                            <p>Charisma
                                <button type="button" className="stats-buttons decrement" onClick={() => decreaseStat('charisma')}>-</button>
                                {stats.charisma} ({calculateBonus(stats.charisma)}) 
                                <button type="button" className="stats-buttons increment" onClick={() => increaseStat('charisma', 1)}>+</button> 
                                <span className="checkbox-container">
                                    <input type="checkbox" checked={selectedPlusTwo === 'charisma'} onChange={() => handleCheckboxChange('charisma', 2)} /> +2
                                    <input type="checkbox" checked={selectedPlusOne === 'charisma'} onChange={() => handleCheckboxChange('charisma', 1)} /> +1
                                </span>
                            </p>
                        </div>
                        <div className = "recommended-stat">
                            Recommended Stat: {recommendedStat()}
                        </div>
                        <div className="buttons-container">
                            <button type="button" className="clear-button" onClick={resetStats}>Clear</button> <br />
                            <button type="submit" className="save-button" onClick={handleSubmit}>Save Character</button>
                        </div>
                    </div>
                )}
                {currentTab === 'spells' && (
                    <div>
                        <h2>Spells</h2>
                        <ul className="no-bullets">
                            {spells.map((spell, index) => (
                                <li key={index}>{spell}</li>
                            ))}
                        </ul>
                        <div className="buttons-container">
                            <button type="submit" className="save-button" onClick={handleSubmit}>Save Character</button>
                        </div>
                    </div>
                )}
                {currentTab === 'items' && (
                    <div>
                       <h2>Select your starting equipment</h2>
                        <div className="equipment-list-CC">
                            <div className="equipment-column-CC">
                                <h5>Armor</h5>
                                {armorList.map((armor, index) => (
                                    <p key={index}>{armor}</p>
                                ))}
                            </div>
                            <div className="equipment-column-CC">
                                <h5>Simple Weapons</h5>
                                {sWeaponsList.map((weapon, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleWeaponSelection(weapon)}
                                        className={selectedWeapon === weapon ? 'selected-weapon' : ''}
                                    >
                                        {weapon}
                                    </button>
                                ))}
                            </div>
                            <div className="equipment-column-CC">
                                <h5>Martial Weapons</h5>
                                {mWeaponsList.map((weapon, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleWeaponSelection(weapon)}
                                        className={selectedWeapon === weapon ? 'selected-weapon' : ''}
                                    >
                                        {weapon}
                                    </button>
                                ))}
                                </div>
                            </div>
                            <div><p>Selected Weapon: {selectedWeapon}</p></div>
                        {/* 
                        Light armour  -- starting armor 11  -- end armor 14
                        Classes: Barbarian, Bard, Cleric, Druid, Fighter, Paladin, Ranger, Rogue, Warlock.

                        Medium armour -- starting armor 13 -- end armor 17
                        Classes: Barbarian, Cleric, Druid, Fighter, Paladin, Ranger.

                        Heavy armour -- starting armor 16 -- end armor 21
                        Classes: Fighter, Paladin.

                        Shields -- starting armor 2 -- end armor 3
                        Classes: Barbarian, Cleric, Druid, Fighter, Paladin, Ranger.
                        Armor works as follows: When equiped, it ignores base armor value and uses the armor value of the item + dexterity bonus.
                        */}

                        <div className="buttons-container">
                            <button type="submit" className="save-button" onClick={handleSubmit}>Save Character</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="character-sheet">
                <p >Hit Points: {calculateHP(stats.constitution) || 0}</p>
                <p>Armor: {calculateArmor(stats.dexterity) || 0}</p>
                <p>Initiative: {calculateBonus(stats.dexterity)}</p>
                <br />
                <p>Saving Throw Bonus</p>
                <p>Strength: {calculateSavingThrow('strength')}</p>
                <p>Dexterity: {calculateSavingThrow('dexterity')}</p>
                <p>Constitution: {calculateSavingThrow('constitution')}</p>
                <p>Intelligence: {calculateSavingThrow('intelligence')}</p>
                <p>Wisdom: {calculateSavingThrow('wisdom')}</p>
                <p>Charisma: {calculateSavingThrow('charisma')}</p>
            </div>
        </div>
    );
}
