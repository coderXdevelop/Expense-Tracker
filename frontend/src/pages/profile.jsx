import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getUserProfile, logout } from "../service/api";


const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/");
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
    </div>
  );

  if (!profile) return null;

  return (
    <div className="page">
      <div className="profile-hero">
        <div className="avatar-wrapper">
          <div className="avatar-placeholder">
            {profile.username[0].toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h2>@{profile.username}</h2>
          <p>{profile.email}</p>
        </div>
      </div>

      <div className="profile-actions">
        <Link to="/profile/update" className="btn btn-secondary">✎ Update Profile</Link>
        <Link to="/add-expense" className="btn btn-primary">+ Add Expense</Link>
        <Link to="/get-expenses" className="btn btn-secondary">📊 View Expenses</Link>
        <button onClick={handleLogout} className="btn btn-danger">⎋ Logout</button>
      </div>
    </div>
  );
};

export default Profile;
