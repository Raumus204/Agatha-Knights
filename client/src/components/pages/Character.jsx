import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { calculateSavingThrow, calculateHP } from '../utils/characterUtils';
import { classBaseHP, classArmor, classBaseST, classWeapons, classArmorList2, martialWeaponsList, simpleWeaponsList } from '../utils/characterConstants';
import { saveTempHP, savePotionUses } from '../utils/characterSaves';
import HPBar from '../HPBar';

import './styles/Character.css';

export default function Character() {
    const [character, setCharacter] = useState(null);
    const [classCharacter, setClassCharacter] = useState('');
    const [tempHP, setTempHP] = useState(0); // Initialize tempHP state
    const [potionUses, setPotionUses] = useState(0); // Initialize potion uses to 3 may change later to start with 0
    const [error, setError] = useState(false);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

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
                    setTempHP(data.character.attributes.tempHP || calculateHP(data.character.stats.constitution, data.character.class, classBaseHP)); // Fetch tempHP from character otherwise calculate HP
                    setPotionUses(data.character.potionUses); // Fetch potion uses from character
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
                <h1>Character</h1>
                <p>No character found. Create a new character:</p>
                <Link to="/CreateCharacter">Create Character</Link>
            </div>
        );
    }

    const classAbilitys = {
        Paladin: ['Divine Smite', 'Lay on Hands', 'Shield of Faith'],
        Cleric: ['Healing Word', 'Guiding Bolt', 'Spiritual Weapon'],
        Fighter: ['Second Wind', 'Action Surge', 'Indomitable'],
        Barbarian: ['Rage', 'Reckless Attack', 'Frenzy'],
        Rogue: ['Sneak Attack', 'Evasion', 'Uncanny Dodge'],
        Ranger: ['Hunter\'s Mark', 'Conjure Animals', 'Lightning Arrow'],
        Druid: ['Wild Shape', 'Moonbeam', 'Call Lightning'],
        Bard: ['Inspiration', 'Vicious Mockery', 'Dispel Magic'],
        Monk: ['Flurry of Blows', 'Patient Defense', 'Step of the Wind'],
        Wizard: ['Magic Missile', 'Fireball', 'Teleport'],
        Sorcerer: ['Magic Missile', 'Fireball', 'Metamagic'],
        Warlock: ['Eldritch Blast', 'Hex', 'Darkness']
    };

    const abilitys = classAbilitys[character.class] || [];

    const mWeaponsList = martialWeaponsList[character.class] || [];
    const sWeaponsList = simpleWeaponsList[character.class] || [];
    const armorList = classArmorList2[character.class] || [];
    const hp = calculateHP(character.stats.constitution, character.class, classBaseHP);

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

    return (
        <div className="character-page">
            <div className="character-container-row">
                <div className="character-container">
                    <div className="character-header">
                        <img className="character-icon" src={character.classImage} alt={character.class} />
                        <h1>{character.name}</h1>
                    </div>
                    <div className="character-stats2">
                        <div className="stat">
                            <span>STR</span>
                            <span>{character.stats.strength}</span>
                        </div>
                        <div className="stat">
                            <span>DEX</span>
                            <span>{character.stats.dexterity}</span>
                        </div>
                        <div className="stat">
                            <span>CON</span>
                            <span>{character.stats.constitution}</span>
                        </div>
                        <div className="stat">
                            <span>INT</span>
                            <span>{character.stats.intelligence}</span>
                        </div>
                        <div className="stat">
                            <span>WIS</span>
                            <span>{character.stats.wisdom}</span>
                        </div>
                        <div className="stat">
                            <span>CHA</span>
                            <span>{character.stats.charisma}</span>
                        </div>
                    </div>
                    <div className="attributes-container">
                        <h5>Attributes</h5>
                        <ul>
                            <li>
                                <span>Hit Points</span>
                                <span>{character.attributes.health || 0}</span>
                            </li>
                            <li>
                                <span>Armor Class</span>
                                <span>{character.attributes.armor || 0}</span>
                            </li>
                            <li>
                                <span>Initiative</span>
                                <span>{character.attributes.initiative || 0}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="abilitys-container">
                        <h5>Abilitys</h5>
                        <ul>
                            {abilitys.map((spell, index) => (
                                <li key={index}>{spell}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="proficiencies-container">
                        <div className="equipment">
                            <h5>Equipment Proficiencies</h5>
                            <ul>
                                <li className="equipment-item">
                                    <span>Armor</span>
                                    <span>x{classArmor[character.class]}</span>
                                    <div className="equipment-list">
                                        {armorList.map((armor, index) => (
                                            <p key={index}>{armor}</p>
                                        ))}
                                    </div>
                                </li>
                                <li className="equipment-item">
                                    <span>Simple Weapons</span>
                                    <span>x{classWeapons[character.class].simpleWeapons}</span>
                                    <div className="equipment-list">
                                        {sWeaponsList.map((weapon, index) => (
                                            <p key={index}>{weapon}</p>
                                        ))}
                                    </div>
                                </li>
                                <li className="equipment-item">
                                    <span>Martial Weapons</span>
                                    <span>x{classWeapons[character.class].martialWeapons}</span>
                                    <div className="equipment-list">
                                        {mWeaponsList.map((weapon, index) => (
                                            <p key={index}>{weapon}</p>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="saving-throws">
                            <h5>Saving Throw Bonus</h5>
                            <ul>
                                <li>
                                    <span>STR</span>
                                    <span>{calculateSavingThrow('strength', character.class, character.stats, classBaseST)}</span>
                                </li>
                                <li>
                                    <span>DEX</span>
                                    <span>{calculateSavingThrow('dexterity', character.class, character.stats, classBaseST)}</span>
                                </li>
                                <li>
                                    <span>CON</span>
                                    <span>{calculateSavingThrow('constitution', character.class, character.stats, classBaseST)}</span>
                                </li>
                                <li>
                                    <span>INT</span>
                                    <span>{calculateSavingThrow('intelligence', character.class, character.stats, classBaseST)}</span>
                                </li>
                                <li>
                                    <span>WIS</span>
                                    <span>{calculateSavingThrow('wisdom', character.class, character.stats, classBaseST)}</span>
                                </li>
                                <li>
                                    <span>CHA</span>
                                    <span>{calculateSavingThrow('charisma', character.class, character.stats, classBaseST)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="create-character-link">
                        <Link to="/CreateCharacter">Create Character</Link>
                    </div>
                </div>
                
            
                
                <div className="war-character-inventory">
                    <div className="war-nav-buttons">
                        <button onClick={() => navigate('/boss')}>Boss</button>
                        <button onClick={() => navigate('/market')}>Go to the Market?</button>
                    </div>
                    <div className="war-gold-and-potions">
                        <div className="war-equipment">
                            <h5>Equipment</h5>
                            <p>Weapon: {character.equipment.weapon}</p>
                            <p>Armor: {character.equipment.armor}</p>
                            <p>Shield: {character.equipment.shield}</p>
                        </div>
                        <div className="war-gold">
                            <h5>Gold</h5>
                            <span>{character.gold}</span>
                        </div>
                        <div className="potion-container-c">
                            <h5>Potions</h5>
                            <span>{potionUses} / 3</span>
                            <br />
                            <button onClick={handleUsePotion}>
                                <img src={getPotionImage()} alt="Potion" className="potion-image" />
                            </button>
                        </div>   
                    </div>
                    <div className="war-character-move war-character-move-large">
                        <HPBar hp={tempHP} maxHp={hp} className="character-HPBar" />
                        <img src={classCharacter} alt="Class Character" className="character-image" />
                    </div>
                </div>
            </div>
                <div className="war-character-container">
                    <div className="war-character-move war-character-move-small">
                        <HPBar hp={tempHP} maxHp={hp} className="character-HPBar" />
                        <img src={classCharacter} alt="Class Character" className="character-image" />
                    </div>
                    <div className="war-character-agatha-large">
                        {character.kings === 1 && (
                            <img src="/Agatha-kings.png" alt="Agatha Kings" className="agatha-kings-image" />
                        )}
                        {character.knights === 1 && (
                            <img src="/Agatha-Knights.png" alt="Agatha Knights" className="agatha-knights-image" />
                        )}
                    </div>
                </div>
                <div className="war-character-agatha-small">
                        {character.kings === 1 && (
                            <img src="/Agatha-kings.png" alt="Agatha Kings" className="agatha-kings-image" />
                        )}
                        {character.knights === 1 && (
                            <img src="/Agatha-Knights.png" alt="Agatha Knights" className="agatha-knights-image" />
                        )}
                </div>
        </div>
    );
}