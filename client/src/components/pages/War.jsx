import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Skeleton, Goblin, Scorpian } from '../Adversary';
import './styles/War.css';

export default function War() {
    const [character, setCharacter] = useState(null);
    const [classCharacter, setClassCharacter] = useState('');
    const [error, setError] = useState(false);
    const [adversary, setAdversary] = useState(null);
    const { auth } = useContext(AuthContext);

    const calculateHP = (constitution) => {
        return 7 + Math.floor((constitution - 8) / 2);
    };

    const calculateArmor = (dexterity) => {
        return 9 + Math.floor((dexterity - 8) / 2);
    };

    const calculateInitiative = (dexterity) => {
        return -1 + Math.floor((dexterity - 8) / 2);
    };

    const selectRandomAdversary = () => {
        const adversaries = [<Goblin />, <Skeleton />, <Scorpian />];
        const randomIndex = Math.floor(Math.random() * adversaries.length);
        return adversaries[randomIndex];
    };

    const getAdversaryImage = () => {
        if (adversary && adversary.type === Goblin) {
            return 'client/public/Goblin.png';
        } else if (adversary && adversary.type === Skeleton) {
            return 'client/public/Skeleton.png';
        } else if (adversary && adversary.type === Scorpian) {
            return 'client/public/Scorpian.png';
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
                    setAdversary(selectRandomAdversary());
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

    return (
        <div className="war-container">
            
            <div className="character-info-container">
                <h2>{character.name}</h2>
                <p>HP: {calculateHP(character.stats.constitution)}</p>
                <p>Armor Class: {calculateArmor(character.stats.dexterity)}</p>
                <p>Initiative: {calculateInitiative(character.stats.dexterity)}</p>
                <p>Attack</p>
                <p>Spell Power</p>
            </div>
            <div className="middle-container">
                <div className="battle-text"><h1>Welcome to the war page!</h1></div>
                <div className="battle-container">
                    <div></div>
                    <img src={classCharacter} alt="Class Character" className="character-image" />
                    <h1>VS</h1>
                    <img src={getAdversaryImage()} alt="Adversary" className="adversary-image" />
                </div>
            </div>

            <div className="enemy-info-container">
                {adversary}
            </div>
        </div>
    );
}