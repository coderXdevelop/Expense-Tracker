import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import { updateUserProfile, getUserProfile } from "../service/Api.js";


const UpdateProfile = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setUsername(profileData.username);
        setEmail(profileData.email);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({ username, email });
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Update Profile</h2>
        <Link to="/profile" className="btn btn-ghost btn-sm">← Back to Profile</Link>
      </div>

      <div className="card">
        {success && <div className="alert alert-success">✓ Profile updated! Redirecting…</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <Link to="/profile" className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
