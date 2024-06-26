"use client";
import './play.css';
import { useEffect } from 'react';

export default function Play({ distance, angle }) {
  const handleChangeShop = () => {
    window.location.href = '/';
  };

  const handleGoal = () => {
    window.location.href = '/result';
  };

  useEffect(() => {
    const compassNeedle = document.getElementById('compass-needle');
    if (compassNeedle) {
      compassNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`; // 位置を中心に保ちつつ回転
    }
  }, [angle]);

  return (
    <main className="main">
      <h1 className="distance">Remaining Distance: {distance} km</h1>
      <div className="compass-container">
        <div className="compass">
          <div id="compass-needle" className="compass-needle"></div>
          <div className="north-indicator">N</div>
          <div className="south-indicator">S</div>
          <div className="east-indicator">E</div>
          <div className="west-indicator">W</div>
        </div>
      </div>
      <p className="paragraph">This is the content of the Play page.</p>
      <div className="buttons">
        <button className="button" onClick={handleChangeShop}>他の店にする</button>
        <button className="button" onClick={handleGoal}>ゴール！</button>
      </div>
    </main>
  );
}

