import React, { useRef, useState } from 'react';
import './styles/Home.css'; // Ensure you have a CSS file for styling

// hook is linked to the handleToggledSound (input element). The inputRef is then attached to the input element using the ref attribute. When the button is clicked, the handleFocus function is called, which accesses the current value of inputRef and calls the focus method on the input element, playing the video audio.

export default function Home() {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const handleToggleSound = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <div className="home-container">
            <video ref={videoRef} autoPlay loop muted className="background-video">
                <source src="client/public/Knight-Video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="home-text">
                <h1>Welcome Adventurer!</h1>

                    <img onClick={handleToggleSound} src={isMuted ? 'client/public/Volume-Off.png' : 'client/public/Volume-On.png'} 
                    alt={isMuted ? 'Unmute' : 'Mute'}
                    className="sound-icon"
                     />
            </div>
        </div>
    );
}