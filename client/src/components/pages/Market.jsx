import React, { useState } from 'react';
import './styles/Market.css';

// Market todo: add Weapons, Armor, Potions, Abilitys/Spells, and a painting of Agatha to go on the Character Page. Add a way to sell, and just add gold.
export default function Market() {

    const [potionUses, setPotionUses] = useState(3); // Initialize potion uses to 3 may change later to start with 0

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
                const newHP = Math.min(prevHP + 5, hp); // Increase HP by 5, but don't exceed max HP // Need to change to 2+1d4? ish? look it up
                saveTempHP(newHP); // Save tempHP to MongoDB
                return newHP;
            });
            setPotionUses((prevUses) => prevUses - 1); // Decrease potion uses by 1
        }
    };



    return (
        <div className="market-container">
            <div className="potion-container-m">
                <button onClick={handleUsePotion}>
                    <img src={getPotionImage()} alt="Potion" className="potion-image" />
                </button>
            </div>
        </div>
    );
}