import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Gamepad2, Trophy, User, ShoppingBag, LogOut, Menu, X, ShieldCheck, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import Button from '../common/Button';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      notifySuccess('Logged out successfully.');
      navigate('/login');
    } catch (err) {
      notifyError(err.message);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  };

  const links = [
    { to: '/play', label: 'Play', icon: <Gamepad2 size={18} /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    { to: '/store', label: 'Store', icon: <ShoppingBag size={18} /> },
  ];

  if (user?.is_staff) {
    links.push({ to: '/admin', label: 'Admin', icon: <ShieldCheck size={18} /> });
  }

  return (
    <header className="ak-navbar">
      <div className="ak-navbar__inner page-container">
        <NavLink to="/" className="ak-navbar__brand">
          Akademiya
        </NavLink>

        {/* Desktop search — hidden inside the dropdown breakpoint */}
        <form
          className="ak-navbar__search ak-navbar__search--desktop"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <input
            type="search"
            className="ak-navbar__search-input"
            placeholder="Search scholars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search scholars by username or bio"
          />
          <button type="submit" className="ak-navbar__search-icon-btn" aria-label="Search">
            <Search size={16} />
          </button>
        </form>

        <nav className={`ak-navbar__links ${menuOpen ? 'ak-navbar__links--open' : ''}`}>
          {/* Mobile search — lives inside the hamburger dropdown */}
          <form
            className="ak-navbar__search ak-navbar__search--mobile"
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <input
              type="search"
              className="ak-navbar__search-input"
              placeholder="Search scholars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search scholars by username or bio"
            />
            <button type="submit" className="ak-navbar__search-icon-btn" aria-label="Search">
              <Search size={16} />
            </button>
          </form>

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `ak-navbar__link ${isActive ? 'ak-navbar__link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <NavLink
                to={user ? `/profile/${user.id}` : '/profile'}
                className={({ isActive }) => `ak-navbar__link ${isActive ? 'ak-navbar__link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} />
                Profile
              </NavLink>
              <button className="ak-navbar__link ak-navbar__link--button" onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate('/login')}>
              Log in
            </Button>
          )}
        </nav>

        <button
          className="ak-navbar__toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}