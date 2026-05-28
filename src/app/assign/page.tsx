'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

type User = { id: string; name: string; color: string };
type Rect = { x: number; y: number; w: number; h: number };
type OcrItem = { id: string; name: string; price: number; rect: Rect; claimedBy: string[] };

export default function AssignPage() {
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [items, setItems] = useState<OcrItem[]>([]);

  useEffect(() => {
    const storedUsers = sessionStorage.getItem('snapsplit_users');
    const storedItems = sessionStorage.getItem('snapsplit_items');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Fallback for direct navigation testing
      setUsers([{ id: '1', name: 'Test User', color: 'red' }, { id: '2', name: 'User 2', color: 'blue' }]);
    }

    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  if (users.length === 0 || items.length === 0) return null;

  const currentUser = users[currentUserIndex];

  const handleToggleItem = (itemId: string) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const isClaimed = item.claimedBy.includes(currentUser.id);
          let newClaimedBy = [...item.claimedBy];
          
          if (isClaimed) {
            newClaimedBy = newClaimedBy.filter(id => id !== currentUser.id);
          } else {
            newClaimedBy.push(currentUser.id);
          }
          
          return { ...item, claimedBy: newClaimedBy };
        }
        return item;
      })
    );
  };

  const handleNextTurn = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Save updated items and go to summary
      sessionStorage.setItem('snapsplit_items', JSON.stringify(items));
      router.push('/summary');
    }
  };

  // Calculate subtotal for current user
  const currentUserSubtotal = items.reduce((sum, item) => {
    if (item.claimedBy.includes(currentUser.id)) {
      return sum + (item.price / item.claimedBy.length);
    }
    return sum;
  }, 0);

  const currentUserColor = `var(--color-${currentUser.color})`;

  const getOtherClaimerNames = (claimedBy: string[], currentUserId: string) => {
    return claimedBy
      .filter(id => id !== currentUserId)
      .map(id => users.find(u => u.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.turnIndicator}>
            <div 
              className={styles.colorDot} 
              style={{ backgroundColor: currentUserColor }}
            />
            {currentUser.name}'s Turn
          </div>
          <p className={styles.subtitle}>Select the items you ordered or shared.</p>
        </div>

        <div className={styles.listContainer}>
          {items.map(item => {
            const isSelected = item.claimedBy.includes(currentUser.id);
            const otherClaimersCount = item.claimedBy.filter(id => id !== currentUser.id).length;

            return (
              <div 
                key={item.id} 
                className={`${styles.itemCard} ${isSelected ? styles.selected : ''}`}
                style={{ borderColor: isSelected ? currentUserColor : '' }}
                onClick={() => handleToggleItem(item.id)}
              >
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>
                    {item.name}
                    {otherClaimersCount > 0 && (
                      <span className={styles.claimBadge} style={{ marginLeft: '8px' }}>
                        (Shared with: {getOtherClaimerNames(item.claimedBy, currentUser.id)})
                      </span>
                    )}
                  </div>
                  <div className={styles.itemPrice}>Rp {item.price.toLocaleString()}</div>
                </div>
                
                <div 
                  className={styles.checkbox}
                  style={{ 
                    backgroundColor: isSelected ? currentUserColor : 'transparent',
                    borderColor: isSelected ? currentUserColor : 'var(--border-color)'
                  }}
                >
                  {isSelected && <span className={styles.checkMark}>✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <div className={styles.subtotal}>
            <span className={styles.subtotalLabel}>Your Subtotal</span>
            <span className={styles.subtotalValue}>Rp {Math.round(currentUserSubtotal).toLocaleString()}</span>
          </div>
          
          <button 
            onClick={handleNextTurn}
            className={styles.finishButton}
            style={{ backgroundColor: currentUserColor }}
          >
            {currentUserIndex === users.length - 1 ? 'Finish & Split' : 'Done, Pass Phone →'}
          </button>
        </div>
      </div>
    </main>
  );
}
