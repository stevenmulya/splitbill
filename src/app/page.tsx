'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/lobby');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Split Bill
          </h1>
          
          <p className={styles.subtitle}>
            Seamlessly scan your restaurant receipt, assign items to participants, and calculate individual totals automatically.
          </p>

          <button onClick={handleStart} className={styles.primaryButton}>
            Get Started
          </button>
        </div>

      </div>
      
      <footer className={styles.footerSignature}>
        Developed by stevenmulya@gmail.com
      </footer>
    </main>
  );
}
