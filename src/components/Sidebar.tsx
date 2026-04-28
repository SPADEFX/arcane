import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const icons = {
  home: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8.5l6-5.5 6 5.5"/><path d="M3.5 7.5V13a.5.5 0 00.5.5h3V11h2v2.5h3a.5.5 0 00.5-.5V7.5"/></svg>,
  extract: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="4"/><path d="M10 10l3.5 3.5"/></svg>,
  shader: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 2v12M2 8h12"/><ellipse cx="8" cy="8" rx="3" ry="6"/></svg>,
  medal: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="9.5" r="4.5"/><path d="M5.5 1.5h5L12 5.5l-4 3-4-3z"/></svg>,
  library: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>,
  builder: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2z"/><path d="M9 9h5v5H9z" strokeDasharray="2 2"/></svg>,
};

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">S</div>
        <div>
          <div className="sidebar-title">Studio</div>
          <div className="sidebar-sub">Build tools</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} end>
          <span className="nav-icon">{icons.home}</span>
          <span className="nav-label">Accueil</span>
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">{icons.library}</span>
          <span className="nav-label">Library</span>
        </NavLink>
        <NavLink to="/my-components" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2h8l2 3H2l2-3z"/><rect x="2" y="5" width="12" height="9" rx="1"/></svg></span>
          <span className="nav-label">My Components</span>
        </NavLink>
        <NavLink to="/builder" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">{icons.builder}</span>
          <span className="nav-label">Builder</span>
        </NavLink>

        <div className="nav-section-title">Outils</div>

        <NavLink to="/extract" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">{icons.extract}</span>
          <span className="nav-label">Extract Tool</span>
        </NavLink>
        <NavLink to="/shader-lab" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">{icons.shader}</span>
          <span className="nav-label">Shader Lab</span>
        </NavLink>
        <NavLink to="/medal-forge" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span className="nav-icon">{icons.medal}</span>
          <span className="nav-label">Medal Forge</span>
        </NavLink>
      </nav>
    </aside>
  );
}
