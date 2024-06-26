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
      <p className="paragraph">距離と方角からゴールを目指せ！</p>
      
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
      
      <div className="buttons">
        <button className="button" onClick={handleChangeShop}>他の店にする</button>
        <button className="button" onClick={handleGoal}>ゴール！</button>
      </div>
    </main>
  );
}

