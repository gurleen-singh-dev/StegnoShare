import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <div className="navbar-icon">S</div>
        <span className="navbar-wordmark">STEGNOSHARE</span>
      </NavLink>

      <div className="navbar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Embed
        </NavLink>
        <NavLink
          to="/extract"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Extract
        </NavLink>
      </div>
    </nav>
  );
}
