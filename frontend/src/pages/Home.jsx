import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      setUser(userProfile);
      navigate('/profile');
    } catch (error) {
      console.error("Profile fetch error:", error);
      alert('Failed to load profile. Please try again.');
    }
  };

  return (
    <div className="page">
      <div className="welcome-banner">
        <h2>
          Welcome{user?.username ? `, ${user.username}` : ' to the Expense Tracker'}
        </h2>
        <p>Manage your finances with clarity and confidence.</p>
      </div>

      <nav className="home-nav">
        <Link to="/expenses/add" className="nav-card">
          <span className="nav-card-icon">➕</span>
          <span className="nav-card-title">Add Expense</span>
          <span className="nav-card-desc">Record a new transaction</span>
        </Link>

        <Link to="/expenses" className="nav-card">
          <span className="nav-card-icon">📊</span>
          <span className="nav-card-title">View Expenses</span>
          <span className="nav-card-desc">Browse your history</span>
        </Link>

        <div
          className="nav-card"
          onClick={handleProfile}
          role="button"
          tabIndex={0}
        >
          <span className="nav-card-icon">👤</span>
          <span className="nav-card-title">Profile</span>
          <span className="nav-card-desc">Manage your account</span>
        </div>

        <button
          className="nav-card"
          onClick={() => {
            setUser(null);
            navigate('/login');
          }}
        >
          <span className="nav-card-icon">⎋</span>
          <span className="nav-card-title">Logout</span>
          <span className="nav-card-desc">End your session</span>
        </button>
      </nav>
    </div>
  );
};

export default Home;
