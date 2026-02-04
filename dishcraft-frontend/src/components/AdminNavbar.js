import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaHome, FaPlusSquare, FaSignOutAlt, 
  FaUsers, FaUtensils, FaUserCircle 
} from 'react-icons/fa';
import DishCraftLogo from '../image/DishCraftLogo.png'; 

const Navbar = ({ isLoggedIn = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null); // Profile image එක තියාගන්න state එකක්
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  // Profile Page එකේ වගේම මෙතනදීත් Image එක Fetch කරගමු
  useEffect(() => {
    if (isLoggedIn && userId) {
      axios.get(`http://localhost:8080/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        // ඔයාගේ API එකෙන් එන field එකට අනුව (උදා: res.data.profileImage) මෙය වෙනස් කරන්න
        setProfilePic(res.data.profileImage || res.data.imageUrl); 
      })
      .catch(err => console.error("Error fetching navbar profile pic:", err));
    }
  }, [userId, token, isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm" style={{ 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #dbdbdb',
      padding: '10px 0'
    }}>
      <div className="container d-flex justify-content-between align-items-center">
        
        <Link className="navbar-brand d-flex align-items-center" to="/recipes">
          <img src={DishCraftLogo} alt="Logo" style={{ height: '38px' }} />
          <span className="ms-2 fw-bold" style={{ color: '#ff6b6b', fontSize: '22px', fontFamily: 'cursive' }}>
            DishCraft
          </span>
        </Link>

        <button className="navbar-toggler border-0" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-center gap-2 gap-lg-4">
            
            <li className="nav-item">
              <Link to="/recipes" className="nav-link text-dark"><FaHome size={24} /></Link>
            </li>
            <li className="nav-item">
              <Link to="/community-group" className="nav-link text-dark"><FaUsers size={24} /></Link>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/myrecipes" className="nav-link text-dark"><FaUtensils size={22} /></Link>
                </li>
                <li className="nav-item">
                  <Link to="/add" className="nav-link text-dark"><FaPlusSquare size={23} /></Link>
                </li>

                {/* --- Profile Image Section --- */}
                <li className="nav-item dropdown ms-lg-2">
                  <div 
                    className="nav-link p-0 d-flex align-items-center dropdown-toggle no-caret"
                    id="profileDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rounded-circle border border-2 border-warning shadow-sm" 
                         style={{ width: "38px", height: "38px", overflow: 'hidden', backgroundColor: '#eee' }}>
                      {profilePic ? (
                        <img 
                          src={profilePic} 
                          alt="Profile" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <FaUserCircle size={34} color="#ccc" />
                      )}
                    </div>
                  </div>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="profileDropdown">
                    <li className="px-3 py-2 fw-bold text-muted small">Hi, {username}</li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link to="/profile" className="dropdown-item">My Profile</Link></li>
                    <li><button onClick={handleLogout} className="dropdown-item text-danger border-0 bg-transparent w-100 text-start">
                      Logout <FaSignOutAlt className="ms-1" />
                    </button></li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="btn btn-outline-warning btn-sm px-4 rounded-pill fw-bold">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;