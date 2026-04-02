import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import {
  Home,
  Heart,
  ImageIcon,
  MessageCircleHeart,
  Music,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import './Navbar.css';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/nosotras', icon: Heart, label: 'Nuestra historia' },
  { to: '/galeria', icon: ImageIcon, label: 'Galería' },
  { to: '/mensajes', icon: MessageCircleHeart, label: 'Beléncita AI' },
  { to: '/playlist', icon: Music, label: 'Playlist' },
  { to: '/deseos', icon: Star, label: 'Deseos' },
];

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Floating butterflies */}
      <div className="sidebar__butterfly sidebar__butterfly--1">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--2">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--3">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--4">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--5">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--6">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--7">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--8">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--9">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--10">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--11">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--12">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--13">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--14">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--15">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--16">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--17">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--18">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--19">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--20">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--21">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--22">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--23">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--24">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--25">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--26">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--27">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--28">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--29">🦋</div>
      <div className="sidebar__butterfly sidebar__butterfly--30">🦋</div>
      {/* Logo / Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <Sparkles size={collapsed ? 20 : 24} strokeWidth={1.5} />
        </div>
        {!collapsed && (
          <span className="sidebar__brand-text">
            Belencita
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="sidebar__divider">
        <span className="sidebar__divider-icon">🦋</span>
      </div>

      {/* Navigation Items */}
      <ul className="sidebar__nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <li key={to} className="sidebar__item">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              title={label}
            >
              <span className="sidebar__link-icon">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              {!collapsed && (
                <span className="sidebar__link-label">{label}</span>
              )}
              {!collapsed && (
                <span className="sidebar__link-glow" aria-hidden="true" />
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Bottom section */}
      <div className="sidebar__footer">
        <div className="sidebar__divider">
          <span className="sidebar__divider-icon">ꕤ</span>
        </div>

        {!collapsed && (
          <p className="sidebar__footer-text">
            Hecho con 🩷 para ti
          </p>
        )}

        <div className="sidebar__user">
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: 36, height: 36 },
              },
            }}
          />
        </div>

        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? (
            <ChevronRight size={18} strokeWidth={2} />
          ) : (
            <ChevronLeft size={18} strokeWidth={2} />
          )}
        </button>
      </div>
    </nav>
  );
}
