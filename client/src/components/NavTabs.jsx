import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function NavTabs() {
  const currentPage = useLocation().pathname;
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  // console.log(auth); // shows if user is authenticated, and the user's username and ID
  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid">
        {/* Logo/Image */}
        <Link to="/">
          <img src="/mounted-knight.png" alt="mounted-knight" width="50px" />
        </Link>

        {/* Navbar Toggler (for small screens) with bootstrap */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Tabs */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/"
                className={currentPage === '/' ? 'nav-link active' : 'nav-link'}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/Character"
                className={currentPage === '/Character' ? 'nav-link active' : 'nav-link'}
              >
                Character
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/War"
                className={currentPage === '/War' ? 'nav-link active' : 'nav-link'}
              >
                Fight For Agatha!
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {auth.isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="user-name-id nav-link">{auth.user.username}</span> {/* Display the logged-in user's username */}
                </li>
                <li className="nav-item">
                  <button className="nav-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  to="/login"
                  className={currentPage === '/login' ? 'nav-link active' : 'nav-link'}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavTabs;