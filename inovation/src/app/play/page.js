'use client';
import './play.css';
import { useEffect } from 'react';

export default function Play({ distance, angle }) {
  const handleChangeShop = () => {
    window.location.href = 'http://localhost:3000/';
  };

  const handleGoal = () => {
    window.location.href = 'http://localhost:3000/result';
  };

  useEffect(() => {
    const compassNeedle = document.getElementById('compass-needle');
    if (compassNeedle) {
      compassNeedle.style.transform = `rotate(${angle}deg)`;
    }
  }, [angle]);

  useEffect(() => {
    if (distance * 1000 <= 20) { // 20m以内になったらゴールページに遷移
      window.location.href = 'http://localhost:3000/result';
    }
  }, [distance]);

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance} km`;
  };

  return (
    <main className="main">
      <h1 className="distance">Remaining Distance: {formatDistance(distance)}</h1>
      <div className="compass-container">
        <div className="compass">
          <div id="compass-needle" className="compass-needle"></div>
        </div>
      </div>
      <div className="buttons">
        <button className="button1" onClick={handleChangeShop}>ほかの店にする</button>
        <button className="button2" onClick={handleGoal}>ゴール！</button>
      </div>
    </main>
  );
}
