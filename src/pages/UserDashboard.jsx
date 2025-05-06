import './css/Dashboard.css';

const UserDashboard = () => {
  const username = localStorage.getItem('username');
  
  return (
    <div className="dashboard-container">
      <h1>User Dashboard</h1>
      <p>Willkommen, {username}!</p>
      {/* Hier kommt der Dashboard-Inhalt */}
    </div>
  );
};

export default UserDashboard;