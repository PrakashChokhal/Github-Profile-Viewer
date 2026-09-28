import React from "react";
import { Users, ExternalLink, ArrowRight, UserCheck } from "lucide-react";

function UsersGrid({ users, onSelectUser, title, subtitle, isFeaturedList }) {
  if (!users || users.length === 0) {
    return (
      <div className="users-empty-state">
        <Users size={40} className="empty-icon" />
        <h3>No Developers Found</h3>
        <p>Try searching with different keywords or skills like "react", "python", "ai", or a name.</p>
      </div>
    );
  }

  return (
    <div className="users-discovery-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">{title || "Discovered Developers"}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <span className="results-count">{users.length} developers</span>
      </div>

      <div className="users-grid">
        {users.map((u) => (
          <div
            key={u.id || u.username || u.login}
            className="user-mini-card"
            onClick={() => onSelectUser(u.login || u.username)}
          >
            <div className="user-avatar-wrap">
              <img
                src={u.avatar_url || `https://github.com/${u.username || u.login}.png`}
                alt={u.login || u.username}
                className="user-mini-avatar"
                loading="lazy"
              />
              <span className="online-indicator" />
            </div>

            <div className="user-mini-details">
              <h3 className="user-mini-login">@{u.login || u.username}</h3>
              {u.name && <p className="user-mini-name">{u.name}</p>}
              {u.role && <p className="user-mini-role">{u.role}</p>}
            </div>

            <div className="user-card-footer">
              <button
                type="button"
                className="inspect-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectUser(u.login || u.username);
                }}
              >
                <span>Inspect</span>
                <ArrowRight size={14} />
              </button>

              <a
                href={u.html_url || `https://github.com/${u.username || u.login}`}
                target="_blank"
                rel="noreferrer"
                className="mini-github-link"
                onClick={(e) => e.stopPropagation()}
                title="Open GitHub"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersGrid;
