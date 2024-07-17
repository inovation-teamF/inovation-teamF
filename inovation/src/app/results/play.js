"use client";
import './play.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Play({ distance, angle, shop }) {
  const router = useRouter();



  // コンパスの針を回転させる処理
  useEffect(() => {
    const compassNeedle = document.getElementById('compass-needle');
    if (compassNeedle) {
      compassNeedle.style.transform = `translateX(-50%) rotate(${angle}deg)`; // 位置を中心に保ちつつ回転
    }
  }, [angle]);

  // 距離に応じて表示と遷移を制御する処理
  useEffect(() => {
    if (distance !== null) {
      const distanceInMeters = distance * 1000; // 距離をメートル単位に変換
      if (distanceInMeters <= 50 && shop) {
        router.push(`/result?shopName=${encodeURIComponent(shop.name)}`);
      }
    }
  }, [distance, shop, router]);

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
      <p className="paragraph">距離と方角からゴールを目指せ！</p>
      
      <h1 className="distance">ゴールまで： {formatDistance()}</h1>
      <div className="compass-container">
        <div className="compass">
          <div id="compass-needle" className="compass-needle"></div>
          <div className="north-indicator">N</div>
          <div className="south-indicator">S</div>
          <div className="east-indicator">E</div>
          <div className="west-indicator">W</div>
        </div>
      </div>
      
      
      
    </main>
  );
}

