import './css/Dashboard.css';
const EditorDashboard = () => {
  const username = localStorage.getItem('username');
  
  return (
    <div className="dashboard-container">
      <h1>Editor Dashboard</h1>
      <p>Willkommen, {username}!</p>
      {/* Hier kommt der Dashboard-Inhalt */}
    </div>
  );
};

export default EditorDashboard;