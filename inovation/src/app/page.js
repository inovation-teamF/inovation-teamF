import Link from "next/link";
import Image from "next/image";
import styles from './page.module.css'; // ファイル構造に応じてインポートを調整してください

function First() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Nomad Eats&nbsp;
          <code className={styles.code}>src/app/page.js</code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <Link href="/play" className={styles.card}>
          <h2>
            スタート <span>-&gt;</span>
          </h2>
          <p>Next.jsの機能とAPIに関する詳細情報を見つけてください。</p>
        </Link>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            学ぶ <span>-&gt;</span>
          </h2>
          <p>クイズ付きのインタラクティブなコースでNext.jsについて学びましょう！</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            テンプレート <span>-&gt;</span>
          </h2>
          <p>Next.js用のスターターテンプレートを探しましょう。</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            デプロイ <span>-&gt;</span>
          </h2>
          <p>
            Vercelで共有可能なURLにNext.jsサイトを即座にデプロイしましょう。
          </p>
        </a>
      </div>
    </main>
  );
}

export default First;
