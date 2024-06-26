'use client';
import './result.css';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResultComponent() {
  const searchParams = useSearchParams();
  const shopName = searchParams.get('shopName');

  const handleChangeShop = () => {
    window.location.href = '/';
  };

  return (
    <main className="main">
      <h1 className="heading">ゴール！！</h1>
      <p className="paragraph">あなたは{shopName ? `"${shopName}"` : '店名'}に到着しました！！</p>
      <div className="buttons">
        <button className="button2" onClick={handleChangeShop}>ほかの店を探す</button>
      </div>
    </main>
  );
}

export default function Result() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultComponent />
    </Suspense>
  );
}
