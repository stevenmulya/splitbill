'use client';

import { useRouter } from 'next/navigation';
import { ScanText, Users, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/upload');
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

        <div className={styles.stepsContainer}>
          <h2 className={styles.stepsTitle}>How it works</h2>
          
          <div className={styles.step}>
            <div className={styles.stepIcon}><ScanText size={24} /></div>
            <div className={styles.stepText}>
              <h3>1. Scan Receipt</h3>
              <p>Upload a photo of your receipt. Our AI extracts items and prices instantly.</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepIcon}><Users size={24} /></div>
            <div className={styles.stepText}>
              <h3>2. Add Friends & Assign</h3>
              <p>Enter everyone's name and tap to select who ate what. It's that easy!</p>
            </div>
          </div>
          
          <div className={styles.step}>
            <div className={styles.stepIcon}><CheckCircle size={24} /></div>
            <div className={styles.stepText}>
              <h3>3. Settle Up</h3>
              <p>Get a clean summary of exactly how much everyone owes, including taxes.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
