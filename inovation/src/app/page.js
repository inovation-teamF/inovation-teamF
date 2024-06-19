"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import styles from './stylesheet/home.module.css'; // モジュールCSSとしてインポート

export default function Home() {
  const [distance, setDistance] = useState('');
  const [genre, setGenre] = useState('');
  const router = useRouter();

  const handleStart = () => {
    router.push(`/results?distance=${distance}&genre=${genre}`);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Nomad Eats</title>
        <meta name="description" content="Find the best nomad-friendly food around you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#">Nomad Eats!</a>
        </h1>

        <p className={styles.description}>
          ～距離とジャンルを選択してノマドな小旅行を～
        </p>

        <div className={styles.selectionSection}>
          <h2>距離を選択</h2>
          <div className={styles.distanceSelection}>
            <button
              className={`${styles.button} ${distance === '1' ? styles.selected : ''}`}
              onClick={() => setDistance('1')}
            >
              近距離(~1km)
            </button>
            <button
              className={`${styles.button} ${distance === '2' ? styles.selected : ''}`}
              onClick={() => setDistance('2')}
            >
              中距離(1~3km)
            </button>
            <button
              className={`${styles.button} ${distance === '3' ? styles.selected : ''}`}
              onClick={() => setDistance('3')}
            >
              遠距離(3~5km)
            </button>
          </div>

          <h2>ジャンルを選択</h2>
          <div className={styles.genreSelection}>
            <button
              className={`${styles.button} ${genre === '4' ? styles.selected : ''}`}
              onClick={() => setGenre('4')}
            >
              和食
            </button>
            <button
              className={`${styles.button} ${genre === '5' ? styles.selected : ''}`}
              onClick={() => setGenre('5')}
            >
              洋食
            </button>
            <button
              className={`${styles.button} ${genre === '6' ? styles.selected : ''}`}
              onClick={() => setGenre('6')}
            >
              中華
            </button>
            <button
              className={`${styles.button} ${genre === '全' ? styles.selected : ''}`}
              onClick={() => setGenre('全')}
            >
              ALL
            </button>
          </div>

          <button className={styles.startButton} onClick={handleStart}>START</button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://yourcompany.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            inovation team F
          </span>
        </a>
      </footer>
    </div>
  );
}
