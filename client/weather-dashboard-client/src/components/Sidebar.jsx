import { NavLink } from "react-router-dom";

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-badge">W</div>
          {!collapsed && (
            <div>
              <h2>WeatherPro</h2>
              <p>Dashboard Suite</p>
            </div>
          )}
        </div>

        <button
          className="icon-btn sidebar-toggle"
          onClick={() => setCollapsed((prev) => !prev)}
          type="button"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-item">
          <span className="nav-icon">⌂</span>
          {!collapsed && <span>Overview</span>}
        </NavLink>

        <NavLink to="/history" className="nav-item">
          <span className="nav-icon">⏱</span>
          {!collapsed && <span>History</span>}
        </NavLink>

        <NavLink to="/insights" className="nav-item">
          <span className="nav-icon">◔</span>
          {!collapsed && <span>Insights</span>}
        </NavLink>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <span className="sidebar-footer-label">Live System</span>
          <strong>React + .NET + SQL</strong>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;