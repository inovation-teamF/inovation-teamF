"use client";

import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import styles from './results.module.css'; // モジュールCSSとしてインポート

export default function Results() {
  const searchParams = useSearchParams();
  const distance = searchParams.get('distance');
  const genre = searchParams.get('genre');

  return (
    <div className={styles.container}>
      <Head>
        <title>Nomad Eats - Results</title>
        <meta name="description" content="Find the best nomad-friendly food around you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Results for {distance} Distance and {genre} Genre
        </h1>
        <p className={styles.description}>
          Displaying restaurants and cafes based on your selections.
        </p>

        {/* コンテンツをここに追加 */}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://yourcompany.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            Your Company
          </span>
        </a>
      </footer>
    </div>
  );
}
