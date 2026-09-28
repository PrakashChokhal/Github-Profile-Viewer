import React, { useState } from "react";
import { Search, X, User, Users, History, TrendingUp } from "lucide-react";
import { FEATURED_DEVELOPERS } from "../utils/githubApi";

function SearchBar({
  onSearch,
  searchMode,
  setSearchMode,
  recentSearches,
  onClearRecent,
  onRemoveRecent,
  isLoading
}) {
  const [inputVal, setInputVal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim(), searchMode);
    }
  };

  const handleQuickSelect = (username) => {
    setInputVal(username);
    onSearch(username, "user");
  };

  return (
    <div className="search-section">
      <div className="search-mode-tabs">
        <button
          type="button"
          className={`mode-tab ${searchMode === "user" ? "active" : ""}`}
          onClick={() => setSearchMode("user")}
        >
          <User size={16} />
          <span>Direct User Profile</span>
        </button>
        <button
          type="button"
          className={`mode-tab ${searchMode === "discover" ? "active" : ""}`}
          onClick={() => setSearchMode("discover")}
        >
          <Users size={16} />
          <span>Discover & Search Users</span>
        </button>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder={
              searchMode === "user"
                ? "Enter exact GitHub username (e.g. torvalds, gaearon)..."
                : "Search developers by name, bio, or skill (e.g. react, rust, ai)..."
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoFocus
          />
          {inputVal && (
            <button
              type="button"
              className="clear-input-btn"
              onClick={() => setInputVal("")}
              aria-label="Clear input"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit" className="search-submit-btn" disabled={isLoading || !inputVal.trim()}>
          {isLoading ? (
            <div className="btn-spinner" />
          ) : (
            <>
              <Search size={18} />
              <span>{searchMode === "user" ? "Analyze Profile" : "Search"}</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Suggestions & Featured */}
      <div className="search-suggestions">
        <div className="suggestion-label">
          <TrendingUp size={14} />
          <span>Popular:</span>
        </div>
        <div className="suggestion-tags">
          {FEATURED_DEVELOPERS.slice(0, 6).map((dev) => (
            <button
              key={dev.username}
              type="button"
              className="suggestion-tag"
              onClick={() => handleQuickSelect(dev.username)}
            >
              @{dev.username}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches && recentSearches.length > 0 && (
        <div className="recent-searches">
          <div className="recent-header">
            <div className="recent-label">
              <History size={14} />
              <span>Recent Searches:</span>
            </div>
            <button type="button" className="clear-recent-btn" onClick={onClearRecent}>
              Clear all
            </button>
          </div>
          <div className="recent-tags">
            {recentSearches.map((item) => (
              <span key={item} className="recent-tag">
                <button
                  type="button"
                  className="recent-tag-name"
                  onClick={() => handleQuickSelect(item)}
                >
                  {item}
                </button>
                <button
                  type="button"
                  className="recent-tag-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecent(item);
                  }}
                  title="Remove from history"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
