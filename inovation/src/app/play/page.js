// src/app/play.js
'use client';
import './play.css';

export default function Play() {
  const handleChangeShop = () => {
    window.location.href = 'http://localhost:3000/';
  };

  const handleGoal = () => {
    window.location.href = 'http://localhost:3000/result';
  };

  return (
    <main className="main">
      <h1 className="heading">Welcome to the Play Page</h1>
      <p className="paragraph">This is the content of the Play page.</p>
      <div className="buttons">
        <button className="button" onClick={handleChangeShop}>ほかの店にする</button>
        <button className="button" onClick={handleGoal}>ゴール！</button>
      </div>
    </main>
  );
}
