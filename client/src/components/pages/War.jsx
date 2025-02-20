import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Skeleton, Goblin, Scorpian } from '../Adversary';
import { calculateHP, calculateArmor } from '../utils/characterUtils';
import { classBaseHP, classArmor, startingClassArmor } from '../utils/characterConstants'; // Import classArmor
import './styles/War.css';
import HPBar from '../HPBar';

export default function War() {
    const [character, setCharacter] = useState(null);
    const [classCharacter, setClassCharacter] = useState('');
    const [error, setError] = useState(false);
    const [adversary, setAdversary] = useState(null);
    const [adversaryName, setAdversaryName] = useState(''); // State for adversary name
    const [tempHP, setTempHP] = useState(0); // Initialize tempHP state
    const [attackMessage, setAttackMessage] = useState(''); // State for attack message
    const [attackHit, setAttackHit] = useState(false); // State to track if the attack hit
    const [criticalHit, setCriticalHit] = useState(false); // State to track if the roll was a critical hit
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

    const selectRandomAdversary = (armorClass) => {
        const adversaries = [
            { component: <Goblin characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Goblin', roll)} />, name: 'Goblin' },
            { component: <Skeleton characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Skeleton', roll)} />, name: 'Skeleton' },
            { component: <Scorpian characterArmorClass={armorClass} onAttack={(damage, roll) => handleAdversaryAttack(damage, 'Scorpian', roll)} />, name: 'Scorpian' }
        ];
        const randomIndex = Math.floor(Math.random() * adversaries.length);
        setAdversaryName(adversaries[randomIndex].name); // Set the adversary name
        console.log(`Selected Adversary: ${adversaries[randomIndex].name}`); // Log selected adversary
        return adversaries[randomIndex].component;
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
                    <HPBar hp={hp} maxHp={20} />
                    <img src={getAdversaryImage()} alt="Adversary" className="adversary-image" />
                    </div>
                </div>
                <div className={`attack-message ${criticalHit ? 'critical' : attackHit ? 'hit' : 'miss'}`}>
                <p>{attackMessage}</p>
            </div>
            </div>
            <div className="enemy-info-container">
                {adversary}
            </div>
        </div>
    );
}