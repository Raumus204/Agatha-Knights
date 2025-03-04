import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Boss.css'; // Ensure you have the appropriate CSS file for styling

export default function Boss() {
    const [enteredDragonsDen, setEnteredDragonsDen] = useState(false);
    const [dragonImage, setDragonImage] = useState('Dragon.png');
    const navigate = useNavigate();

    const handleEnterDragonsDen = () => {
        setEnteredDragonsDen(true);
    };

    // const handleDeadDragon = () => {
    //     setDragonImage('/Dead-Dragon.png');
    // };

    const handleToggleDragonImage = () => {
        setDragonImage((prevImage) => (prevImage === 'Dragon.png' ? 'Dead-Dragon.png' : 'Dragon.png'));
    };

    return (
        <div className={`boss-container ${enteredDragonsDen ? '' : 'background-image-boss'}`}>
            {!enteredDragonsDen ? (
                <div className="dragons-den-container">
                    <button className="return-button" onClick={() => navigate('/character')}>Return Home?</button>
                    <button onClick={handleEnterDragonsDen}>Wake the Dragon?</button>
                    <img src="/Dragon-entrance.png" alt="Dragon Entrance" className="dragons-den" />
                </div>
            ) : (
                <div className="boss-page">
                    <h1>Boss Page</h1>
                    <div className="boss-content">
                        <button onClick={handleToggleDragonImage}>Dead</button>
                        <img src={dragonImage} alt="Dragon" />
                    </div>
                </div>
            )}
        </div>
    );
}

