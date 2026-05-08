import { NavLink } from "react-router-dom";
import logo from "/public/logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <img src={logo} alt="S" className="navbar-icon" />
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
