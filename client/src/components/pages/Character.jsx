import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { calculateHP, calculateArmor, calculateSavingThrow } from '../utils/characterUtils';
import { classBaseHP, startingClassArmor, classArmor, classBaseST, classWeapons } from '../utils/characterConstants';
import './styles/Character.css';
import HPBar from '../HPBar';

export default function Character() {
    const [character, setCharacter] = useState(null);
    const [classCharacter, setClassCharacter] = useState('');
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

    const calculateInitiative = (dexterity) => {
        return -1 + Math.floor((dexterity - 8) / 2);
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

    const classSpells = {
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

    const spells = classSpells[character.class] || [];

    const martialWeaponsList =
    ['Flails', 'Morningstars', 'Rapiers', 'Scimitars', 'Shortswords', 'War Picks', 'BattleAxes', 'Longswords', 'Tridents', 'WarHammers', 'Glaives', 'Greataxes', 'Greatswords', 'Halberds', 'Mauls', 'Pikes', 'Hand Crossbows', 'Heavy Crossbows', 'Longbows'];

    const simpleWeaponsList = ['Clubs', 'Daggers', 'Handaxes', 'Javelins', 'Light Hammers', 'Maces', 'Sickles', 'Quarterstaves', 'Spears', 'Greatclubs', 'Light Crossbows', 'Shortbows'];

    const armorList = ['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shields'];


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
                            <span>{calculateHP(character.stats.constitution, character.class, classBaseHP) || 0}</span>
                        </li>
                        <li>
                            <span>Armor Class</span>
                            <span>{calculateArmor(character.stats.dexterity, character.class, startingClassArmor) || 0}</span>
                        </li>
                        <li>
                            <span>Initiative</span>
                            <span>{calculateInitiative(character.stats.dexterity) || 0}</span>
                        </li>
                    </ul>
                </div>
                <div className="spells-container">
                    <h5>Spells</h5>
                    <ul>
                        {spells.map((spell, index) => (
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
                                <div className ="equipment-list">
                                    {simpleWeaponsList.map((weapon, index) => (
                                        <p key={index}>{weapon}</p>
                                    ))}
                                </div>
                            </li>
                            <li className="equipment-item">
                                <span>Martial Weapons</span>
                                <span>x{classWeapons[character.class].martialWeapons}</span>
                                <div className="equipment-list">
                                    {martialWeaponsList.map((weapon, index) => (
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
                <HPBar hp={calculateHP(character.stats.constitution, character.class, classBaseHP)} maxHp={10} /> 
                <img src={classCharacter} alt="Class Character" className="character-image" />
            </div>
        </div>
    );
}
