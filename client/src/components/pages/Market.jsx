import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { saveTempHP, savePotionUses, saveGold } from '../utils/characterSaves';
import { calculateHP } from '../utils/characterUtils';
import { classBaseHP } from '../utils/characterConstants';
import HPBar from '../HPBar';
import './styles/Market.css';

// Market todo: add Weapons, Armor, Potions, Abilitys/Spells, and a painting of Agatha to go on the Character Page. Add a way to sell, and just add gold.
export default function Market() {
    const [character, setCharacter] = useState(null);
    const [classCharacter, setClassCharacter] = useState(null);
    const [tempHP, setTempHP] = useState(0);
    const [potionUses, setPotionUses] = useState(3); // Initialize potion uses to 3 may change later to start with 0
    const [,setGold] = useState(0); // Initialize gold state
    const { auth } = useContext(AuthContext);
    const [error, setError] = useState(false);

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
                <h2>Market</h2>
                <p>No character found.</p>
            </div>
        );
    }

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

    const handleBuyPotion = async () => {
        if (character.gold >= 5 && potionUses < 3) {
            setPotionUses((prevUses) => {
                const newPotionUses = Math.min(prevUses + 1, 3); // Increase potion uses by 1, but don't exceed 3
                savePotionUses(auth.user._id, newPotionUses); // Save potion uses to MongoDB
                return newPotionUses;
            });
            const newGold = character.gold - 5;
            setGold(newGold);
            await saveGold(auth.user._id,newGold ); // Save gold to MongoDB
            setCharacter((prevCharacter) => ({
                ...prevCharacter,
                gold: newGold,
             })); // Update the character state with the new gold amount
        }
    };

    return (
        <div className="market-container">
            
            <div className="market-content">
                
                <div className="item-info">
                    <HPBar hp={tempHP} maxHp={hp} className="character-HPBar" />
                    <h3>{character.name}</h3>
                    <br />
                    <h5>Equipment</h5>
                    <p>Weapon: {character.weapon}</p>
                    <p>Armor: {character.armor}</p>
                    <br />
                    <h5>Gold</h5>
                    <p>{character.gold}</p>
                    <br />
                    <h5>Health Potions</h5>
                    <p>{potionUses} / 3</p>
                    <button onClick={handleUsePotion}>
                        <img src={getPotionImage()} alt="Potion" className="potion-image" />
                    </button>
                </div>
                <div className="shop-container">
                    <h5>Shop</h5>
                    <h6>Health Potion</h6>
                    <p>Price: 5 gold</p>
                    <button>
                    {/* <button onClick={handleBuyPotion}> */}
                        <img onClick={handleBuyPotion} src="/HP-potions4.png" alt="Potion" className="potion-image" />
                    </button>
                </div>
            </div>
        </div>
    );
}