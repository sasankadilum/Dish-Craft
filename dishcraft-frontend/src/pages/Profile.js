import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCircle, LogOut, Camera, Save, ArrowLeft, Grid, Info, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [myRecipes, setMyRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'about'
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch User Profile
        const userRes = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(userRes.data);
        if (userRes.data.profileImage) setImagePreview(userRes.data.profileImage);

        // Fetch User Recipes
        const recipeRes = await axios.get(`http://localhost:8080/api/recipes/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyRecipes(recipeRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchData();
  }, [userId, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8080/api/users/${userId}`, profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setEdit(false);
      setShowSuccessModal(true);
    } catch (err) {
      alert('Update failed!');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading && !profile) return <div className="text-center mt-5">Loading Profile...</div>;

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Header */}
      <div style={{ maxWidth: '935px', margin: '0 auto', padding: '20px 10px' }} className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <ArrowLeft size={24} onClick={() => navigate('/recipes')} style={{ cursor: 'pointer', marginRight: '15px' }} />
          <h4 style={{ fontWeight: '600', margin: 0 }}>{profile?.username}</h4>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
      </div>

      <div style={{ maxWidth: '935px', margin: '0 auto', padding: '0 20px' }}>
        {/* Profile Info Section */}
        <div className="row mb-5 mt-4">
          <div className="col-4 d-flex justify-content-center">
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dbdbdb' }}>
              {imagePreview ? <img src={imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="profile" /> : <UserCircle size={150} color="#ccc" />}
            </div>
          </div>
          <div className="col-8">
            <div className="d-flex align-items-center gap-3 mb-3">
              <h2 style={{ fontSize: '28px', fontWeight: '300' }}>{profile?.username}</h2>
              <button onClick={() => setEdit(true)} className="btn btn-light border btn-sm fw-bold">Edit Profile</button>
              {profile?.roles?.includes('ROLE_ADMIN') && <Link to="/admin" className="btn btn-primary btn-sm fw-bold">Admin</Link>}
            </div>
            <div className="d-flex gap-4 mb-3">
              <span><b>{myRecipes.length}</b> recipes</span>
              {/* <span><b>0</b> followers</span>
              <span><b>0</b> following</span> */}
            </div>
            <div>
              <span className="fw-bold">{profile?.firstName} {profile?.lastName}</span>
              <p className="text-muted">Member</p>
            </div>
          </div>
        </div>

        <hr />

        {/* Tabs - Instagram Style */}
        <div className="d-flex justify-content-center gap-5 mb-4">
          <div 
            onClick={() => { setActiveTab('posts'); setEdit(false); }}
            style={{ cursor: 'pointer', borderTop: activeTab === 'posts' ? '1px solid black' : 'none', paddingTop: '10px', fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}
          >
            <Grid size={14} className="me-1" /> POSTS
          </div>
          <div 
            onClick={() => setActiveTab('about')}
            style={{ cursor: 'pointer', borderTop: activeTab === 'about' ? '1px solid black' : 'none', paddingTop: '10px', fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}
          >
            <Info size={14} className="me-1" /> ABOUT
          </div>
        </div>

        {/* Dynamic Content Based on Tab */}
        {edit ? (
           <div className="card p-4 shadow-sm">
             <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-bold">First Name</label>
                  <input type="text" className="form-control" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Last Name</label>
                  <input type="text" className="form-control" value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary me-2">Save</button>
                <button type="button" onClick={() => setEdit(false)} className="btn btn-secondary">Cancel</button>
             </form>
           </div>
        ) : activeTab === 'posts' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {myRecipes.map((recipe) => (
              <Link to={`/recipes/${recipe.id}`} key={recipe.id} style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
                <img 
                  src={recipe.imageUrl || 'https://via.placeholder.com/300'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter 0.3s' }}
                  alt={recipe.title}
                  onMouseEnter={(e) => e.target.style.filter = 'brightness(70%)'}
                  onMouseLeave={(e) => e.target.style.filter = 'brightness(100%)'}
                />
              </Link>
            ))}
            {myRecipes.length === 0 && <p className="text-center w-100 mt-4 text-muted">No recipes posted yet.</p>}
          </div>
        ) : (
          <div className="card p-4 border-0 shadow-sm rounded-3">
            <h5 className="mb-3 border-bottom pb-2">User Information</h5>
            <p><b>Username:</b> @{profile?.username}</p>
            <p><b>Full Name:</b> {profile?.firstName} {profile?.lastName}</p>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white p-5 rounded-4 text-center shadow">
            <Check size={50} color="green" className="mb-3" />
            <h3>Success!</h3>
            <p>Profile updated successfully.</p>
            <button className="btn btn-primary w-100" onClick={() => setShowSuccessModal(false)}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;