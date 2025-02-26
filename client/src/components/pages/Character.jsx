import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { calculateSavingThrow, calculateHP } from '../utils/characterUtils';
import { classBaseHP, classArmor, classBaseST, classWeapons, classArmorList, martialWeaponsList, simpleWeaponsList } from '../utils/characterConstants';
import HPBar from '../HPBar';
import './styles/Character.css';

export default function Character() {
    const [character, setCharacter] = useState(null);
    const [classCharacter, setClassCharacter] = useState('');
    const [tempHP, setTempHP] = useState(0); // Initialize tempHP state
    const [potionUses, setPotionUses] = useState(3); // Initialize potion uses to 3 may change later to start with 0
    const [error, setError] = useState(false);
    const { auth } = useContext(AuthContext);

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

    const saveTempHP = async (hp) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/characters/${auth.user._id}/tempHP`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tempHP: hp }),
            });
        } catch (error) {
            console.error('Error saving tempHP:', error);
        }
    };

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
    const armorList = classArmorList[character.class] || [];
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

    const handleUsePotion = () => {
        if (potionUses > 0) {
            setTempHP((prevHP) => {
                const newHP = Math.min(prevHP + 5, hp); // Increase HP by 5, but don't exceed max HP
                saveTempHP(newHP); // Save tempHP to MongoDB
                return newHP;
            });
            setPotionUses((prevUses) => prevUses - 1); // Decrease potion uses by 1
        }
    };

    return (
        <div className="character-page">
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
            <div className="war-character-container">
                <div className="potion-container">
                    <h5>Potions</h5>
                    <span>{potionUses} uses left</span>
                    <br />
                    <button onClick={handleUsePotion}>
                        <img src={getPotionImage()} alt="Potion" className="potion-image" />
                    </button>
                </div>
                <HPBar hp={tempHP} maxHp={hp} className="character-HPBar" />
                <img src={classCharacter} alt="Class Character" className="character-image" />
             </div>
        </div>
    );
}