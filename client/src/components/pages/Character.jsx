import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './styles/Character.css';

export default function Character() {
    const [character, setCharacter] = useState(null);
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

    const calculateHP = (constitution) => {
        return 7 + Math.floor((constitution - 8) / 2);
    };

    const calculateArmor = (dexterity) => {
        return 9 + Math.floor((dexterity - 8 ) / 2);
    };

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

    return (
        <div className="character-container">
            <div className="character-header">
                <img className="character-image" src={character.classImage} alt={character.class} />
                <h1>{character.name}</h1>
            </div>
            <div className="character-stats">
                <p>Strength: {character.stats.strength}</p>
                <p>Dexterity: {character.stats.dexterity}</p>
                <p>Constitution: {character.stats.constitution}</p>
                <p>Intelligence: {character.stats.intelligence}</p>
                <p>Wisdom: {character.stats.wisdom}</p>
                <p>Charisma: {character.stats.charisma}</p>
            </div>
            <div>
                <p>HP: {calculateHP(character.stats.constitution)}</p>
                <p>Armor Class: {calculateArmor(character.stats.dexterity)} </p>
                <p>Initiative: {calculateInitiative(character.stats.dexterity)} </p>
                
            </div>
            <Link to="/CreateCharacter">Create Character</Link>
        </div>
    );
}