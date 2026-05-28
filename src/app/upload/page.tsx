'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Loader2, ArrowRight } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyze = async () => {
    if (!file || !previewUrl) return;
    
    setIsAnalyzing(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
      
      const imageBase64 = await base64Promise;
      
      // Call our internal Gemini API
      const response = await fetch('/api/analyze-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'API responded with status ' + response.status);
      }

      const data = await response.json();
      
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid response format: ' + JSON.stringify(data));
      }

      // Format the items
      const parsedItems = data.items.map((item: any, index: number) => ({
        id: Date.now().toString() + index,
        name: item.name,
        price: item.price,
        claimedBy: [],
        rect: {x:0, y:0, w:0, h:0} 
      }));
      
      sessionStorage.setItem('snapsplit_items', JSON.stringify(parsedItems));
      sessionStorage.setItem('snapsplit_tax', (data.taxAndService || 0).toString());
      sessionStorage.setItem('snapsplit_image', previewUrl);
      router.push('/verify'); 
    } catch (error: any) {
      console.error('API Error:', error);
      setErrorMsg(error?.message || 'Unknown Error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <ArrowLeft size={20} /> Back
          </button>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>Upload Receipt</h1>
            <p className={styles.subtitle}>Take a clear photo of your restaurant receipt for automatic scanning.</p>
          </div>
        </div>

        <div 
          className={`${styles.uploadArea} ${previewUrl ? styles.hasImage : ''}`}
          onClick={() => !previewUrl && !isAnalyzing && fileInputRef.current?.click()}
        >
          {errorMsg ? (
            <div className={styles.loadingOverlay} style={{ padding: '2rem', textAlign: 'center', zIndex: 20, background: 'var(--surface-color)' }}>
              <h3 style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 700 }}>Scan Failed</h3>
              <div style={{ 
                background: 'rgba(0,0,0,0.02)', 
                border: '1px solid var(--border-color)',
                padding: '1rem', 
                borderRadius: '8px', 
                marginBottom: '1.5rem', 
                wordBreak: 'break-word', 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)',
                textAlign: 'left'
              }}>
                <strong>Error Details:</strong><br/>
                {errorMsg}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    navigator.clipboard.writeText(errorMsg); 
                    alert('Error message copied to clipboard!'); 
                  }} 
                  style={{ padding: '10px 16px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '99px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  Copy Error
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setErrorMsg(null); 
                  }} 
                  style={{ padding: '10px 16px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '99px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  Try Again
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    sessionStorage.setItem('snapsplit_items', '[]');
                    sessionStorage.setItem('snapsplit_tax', '0');
                    sessionStorage.setItem('snapsplit_image', previewUrl || '');
                    router.push('/verify');
                  }} 
                  style={{ padding: '10px 16px', background: 'var(--primary-accent)', color: 'white', border: 'none', borderRadius: '99px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Add Manually
                </button>
              </div>
            </div>
          ) : isAnalyzing && (
            <div className={styles.loadingOverlay}>
              <Loader2 className={styles.bigSpinner} size={48} />
              <h2>Analyzing Receipt</h2>
              <p>Please wait while we extract the items and prices.</p>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*"
            className={styles.hiddenInput}
            disabled={isAnalyzing}
          />
          
          {previewUrl ? (
            <div className={styles.previewContainer}>
              <img src={previewUrl} alt="Receipt preview" className={styles.previewImage} />
              {!isAnalyzing && (
                <button 
                  className={styles.reselectButton}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Choose Different Photo
                </button>
              )}
            </div>
          ) : (
            <div className={styles.uploadPrompt}>
              <div className={styles.iconWrapper}><Camera size={32} /></div>
              <h3>Tap to open camera</h3>
              <p>Or choose from gallery</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button 
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className={`${styles.analyzeButton} ${(!file || isAnalyzing) ? styles.disabled : ''}`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className={styles.spinner} size={24} />
                Processing...
              </>
            ) : (
              <>
                Process Receipt <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
