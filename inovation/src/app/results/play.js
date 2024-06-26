'use client';
import './play.css';
import { useEffect } from 'react';

export default function Play({ distance, angle }) {
  const handleChangeShop = () => {
    window.location.href = '/';
  };

  const handleGoal = () => {
    window.location.href = '/result';
  };

  // コンパスの針を回転させる処理
  useEffect(() => {
    const compassNeedle = document.getElementById('compass-needle');
    if (compassNeedle) {
      compassNeedle.style.transform = `rotate(${angle}deg)`;
    }
  }, [angle]);

  // 距離に応じて表示と遷移を制御する処理
  useEffect(() => {
    if (distance !== null) {
      const distanceInMeters = distance * 1000; // 距離をメートル単位に変換
      if (distanceInMeters <= 20) {
        router.push(`/result?shopName=${encodeURIComponent(randomShop.name)}`);
      }
    }
  }, [distance]);

  // 距離のフォーマットを切り替える関数
  const formatDistance = () => {
    const distanceInMeters = distance * 1000; // 距離をメートル単位に変換
    if (distance < 1) {
      return `${Math.round(distanceInMeters)} m`;
    }
    return `${distance} km`;
  };

  return (
    <main className="main">
      <p className="paragraph">残り距離と方角だけで店にたどり着こう！</p>
      <h1 className="distance">残り距離: {formatDistance()}</h1>
      <div className="compass-container">
        <div className="compass">
          <div id="compass-needle" className="compass-needle"></div>
        </div>
      </div>
      <div className="buttons">
        <button className="button" onClick={handleChangeShop}>ほかの店にする</button>
        <button className="button" onClick={handleGoal}>ゴール！</button>
      </div>
    </main>
  );
}