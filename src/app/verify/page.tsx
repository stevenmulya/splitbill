'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

type Rect = { x: number; y: number; w: number; h: number };
type OcrItem = { id: string; name: string; price: number; rect: Rect; claimedBy: string[] };

const MOCK_OCR_ITEMS: OcrItem[] = [
  { id: '1', name: 'Nasi Goreng Spesial', price: 45000, rect: { x: 0, y: 0, w: 0, h: 0 }, claimedBy: [] },
  { id: '2', name: 'Es Teh Manis', price: 10000, rect: { x: 0, y: 0, w: 0, h: 0 }, claimedBy: [] },
  { id: '3', name: 'Ayam Bakar Madu', price: 35000, rect: { x: 0, y: 0, w: 0, h: 0 }, claimedBy: [] },
  { id: '4', name: 'Sate Ayam (10tk)', price: 30000, rect: { x: 0, y: 0, w: 0, h: 0 }, claimedBy: [] },
  { id: '5', name: 'Kerupuk', price: 5000, rect: { x: 0, y: 0, w: 0, h: 0 }, claimedBy: [] },
];

export default function VerifyPage() {
  const router = useRouter();
  const [items, setItems] = useState<OcrItem[]>([]);
  const [taxAndService, setTaxAndService] = useState<number>(0);

  useEffect(() => {
    const storedItems = sessionStorage.getItem('snapsplit_items');
    const storedTax = sessionStorage.getItem('snapsplit_tax');
    
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      setItems(MOCK_OCR_ITEMS);
    }
    
    if (storedTax) {
      setTaxAndService(parseInt(storedTax, 10) || 0);
    }
  }, []);

  const handleRestart = () => {
    router.push('/upload');
  };

  const handleConfirm = () => {
    sessionStorage.setItem('snapsplit_items', JSON.stringify(items));
    sessionStorage.setItem('snapsplit_tax', taxAndService.toString());
    router.push('/assign');
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
    setTaxAndService(isNaN(val) ? 0 : val);
  };

  const handleItemChange = (id: string, field: 'name' | 'price', value: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field === 'price') {
          const val = parseInt(value.replace(/\D/g, ''), 10);
          return { ...item, price: isNaN(val) ? 0 : val };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: 'New Item', price: 0, rect: {x:0, y:0, w:0, h:0}, claimedBy: [] }
    ]);
  };

  if (items.length === 0) return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
           <h1 className={styles.title}>No Items Found</h1>
           <p className={styles.subtitle}>We couldn't read any items from the image.</p>
        </div>
        <button onClick={handleAddItem} className={styles.addButton}>
          + Add Item Manually
        </button>
        <button onClick={handleRestart} className={styles.restartButton} style={{marginTop: '1rem'}}>
          Upload Different Photo
        </button>
      </div>
    </main>
  );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backButton}>← Back</button>
          <h1 className={styles.title}>Check the Bill</h1>
          <p className={styles.subtitle}>Review the items we found. Edit, add, or delete if needed.</p>
        </div>

        <div className={styles.listContainer}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemEdit}>
                <input 
                  type="text" 
                  value={item.name} 
                  onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                  className={`${styles.editInput} ${styles.nameInput}`}
                  placeholder="Item Name"
                />
                <input 
                  type="text" 
                  value={item.price ? item.price.toLocaleString() : ''} 
                  onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                  className={`${styles.editInput} ${styles.priceInput}`}
                  placeholder="0"
                />
                <button 
                  onClick={() => handleDeleteItem(item.id)} 
                  className={styles.deleteButton}
                  title="Remove Item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button onClick={handleAddItem} className={styles.addButton}>
            + Add Missing Item
          </button>
        </div>

        <div className={styles.taxSection}>
          <div className={styles.taxLabel}>Tax & Service Charge</div>
          <div className={styles.taxInputWrapper}>
            <span>Rp</span>
            <input 
              type="text" 
              value={taxAndService.toLocaleString()} 
              onChange={handleTaxChange}
              className={styles.taxInput}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={handleRestart} className={styles.restartButton}>
            Restart
          </button>
          <button onClick={handleConfirm} className={styles.confirmButton}>
            Looks Correct, Go
          </button>
        </div>
      </div>
    </main>
  );
}
