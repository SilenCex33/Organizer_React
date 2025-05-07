import './css/Dashboard.css';
import Calendar from '../components/Calendar'; // Importiere die Kalender-Komponente
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const username = localStorage.getItem('username');
  const [showWelcome, setShowWelcome] = useState(true); // State für Sichtbarkeit

  // Nach 3 Sekunden das Willkommens-Text ausblenden
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowWelcome(false);
    }, 3000); // 3000 ms = 3 Sekunden

    return () => clearTimeout(timeout); // Timeout beim Unmount aufräumen
  }, []);

  return (
    <div className={`dashboard-container ${!showWelcome ? 'shift-up' : ''}`}>
      {showWelcome && (
        <p className={`welcome-text ${!showWelcome ? 'fade-out' : ''}`}>
        Willkommen, {username}!
      </p>
      )}
      {/* Admin spezifische Funktionen */}
      <div className="dashboard-content">
        <Calendar />
      </div>
    </div>
  );
};

export default AdminDashboard;