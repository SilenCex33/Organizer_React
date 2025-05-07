import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importieren Sie useNavigate
import './css/Login.css';

// Vordefinierte Benutzer
const predefinedUsers = [
  { username: 'admin', password: 'admin123', role: 'Admin' },
  { username: 'editor', password: 'editor123', role: 'Editor' },
  { username: 'user', password: 'user123', role: 'User' }
];

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook für die Navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Überprüfen der Anmeldedaten
    const user = predefinedUsers.find(
      user => user.username === username && user.password === password
    );

    if (user) {
      setError('');
      // Speichern der Benutzerrolle
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('username', user.username);

      // Weiterleitung basierend auf der Rolle
      switch(user.role) {
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        case 'Editor':
          navigate('/editor-dashboard');
          break;
        case 'User':
          navigate('/user-dashboard');
          break;
        default:
          navigate('/user-dashboard');
      }
    } else {
      setError('Ungültiger Benutzername oder Passwort');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Benutzername" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='current-password'
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Anmelden</button>
      </form>
    </div>
  );
};

export default Login;