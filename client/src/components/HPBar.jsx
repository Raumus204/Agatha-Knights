import React from 'react';

const HPBar = ({ hp, maxHp }) => {
  const hpPercentage = (hp / maxHp) * 100;
  let hpColor;

  if (hpPercentage < 20) {
    hpColor = 'red';
  } else if (hpPercentage < 50) {
    hpColor = 'orange';
  } else {
    hpColor = '#4caf50'; // Green
  }

  return (
    <div className="hp-bar-container">
      <div className="hp-bar" style={{ width: `${hpPercentage}%`, backgroundColor: hpColor }}></div>
    </div>
  );
};

export default HPBar;