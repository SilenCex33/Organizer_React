import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Firestore und Auth importieren
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null); // Zustand für Nutzerdaten
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Anmeldung mit Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Eingeloggt als:', user.email);

      // Nutzerdaten aus Firestore laden
      const docRef = doc(db, 'users', user.uid); // Nutzer-Dokument basierend auf UID
      const userSnap = await getDoc(docRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log('Nutzerdaten:', userData);
        setUserData(userData);

        // Speichern von Benutzerdaten im localStorage
        localStorage.setItem('username', userData.name);
        localStorage.setItem('role', userData.role);

        // Rollenbasierte Weiterleitung
        if (userData.role === 'Admin') {
          navigate('/admin-dashboard');
        } else if (userData.role === 'Editor') {
          navigate('/editor-dashboard');
        } else if (userData.role === 'User') {
          navigate('/user-dashboard'); 
        } else {
          console.error('Unbekannte Rolle:', userData.role);
          setError('Unbekannte Rolle. Bitte kontaktieren Sie den Support.');
        }
        console.log('Aktuelle Benutzerrolle:', userData.role);
      } else {
        console.log('Keine Dokumente gefunden');
        setError('Keine Nutzerdaten gefunden.');
      }
    } catch (error) {
      console.error('Login-Fehler:', error.message);
      setError('Ungültige Anmeldedaten');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete='username'
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Anmelden</button>
      </form>
    </div>
  );
};

export default Login;