'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, X, ArrowRight } from 'lucide-react';

const AVAILABLE_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];

export default function LobbyPage() {
  const [users, setUsers] = useState<{ id: string; name: string; color: string }[]>([]);
  const [newName, setNewName] = useState('');
  const router = useRouter();

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Assign the next available color
    const colorIndex = users.length % AVAILABLE_COLORS.length;
    const color = AVAILABLE_COLORS[colorIndex];

    setUsers([
      ...users,
      { id: Date.now().toString(), name: newName.trim(), color }
    ]);
    setNewName('');
  };

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleNext = () => {
    if (users.length === 0) return;
    sessionStorage.setItem('snapsplit_users', JSON.stringify(users));
    router.push('/assign');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <ArrowLeft size={20} /> Back
          </button>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>Add Participants</h1>
            <p className={styles.subtitle}>Enter the names of everyone sharing this bill.</p>
          </div>
        </div>

        <form onSubmit={handleAddUser} className={styles.addForm}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter a name (e.g. Charlie)"
              className={styles.input}
              autoFocus
            />
            <button type="submit" className={styles.addButton} disabled={!newName.trim()}>
              <UserPlus size={20} />
            </button>
          </div>
        </form>

        <div className={styles.userList}>
          {users.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <div 
                  className={styles.colorAvatar} 
                  style={{ backgroundColor: `var(--color-${user.color})`, color: '#fff' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{user.name}</span>
              </div>
              <button 
                onClick={() => handleRemoveUser(user.id)}
                className={styles.removeButton}
              >
                <X size={18} />
              </button>
            </div>
          ))}
          
          {users.length === 0 && (
            <div className={styles.emptyState}>
              <p>No participants added yet.<br/>Add at least two people to begin.</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button 
            onClick={handleNext}
            disabled={users.length === 0}
            className={`${styles.nextButton} ${users.length === 0 ? styles.disabled : ''}`}
          >
            Next Step <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
