import React from "react";
import { Moon, Sun, Bookmark, Sparkles } from "lucide-react";
import { GithubIcon } from "./Icons";

function Header({ theme, toggleTheme, bookmarksCount, onOpenBookmarks, onSelectFeatured }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand" onClick={() => onSelectFeatured && onSelectFeatured("torvalds")} role="button" tabIndex={0}>
          <div className="brand-icon-wrapper">
            <GithubIcon className="brand-icon" size={24} />
            <Sparkles className="brand-sparkle" size={12} />
          </div>
          <div className="brand-text">
            <span className="brand-title">GitPulse</span>
            <span className="brand-badge">PRO</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="action-btn bookmark-btn"
            onClick={onOpenBookmarks}
            title="Saved Developer Bookmarks"
          >
            <Bookmark size={18} />
            <span className="btn-text">Bookmarks</span>
            {bookmarksCount > 0 && <span className="counter-badge">{bookmarksCount}</span>}
          </button>

          <button
            className="action-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a
            href="https://github.com/PrakashChokhal/Github-Profile-Viewer"
            target="_blank"
            rel="noreferrer"
            className="action-btn github-link-btn"
            title="View Source on GitHub"
          >
            <GithubIcon size={18} />
            <span className="btn-text">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;