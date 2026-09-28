import React, { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  RefreshCw,
  Sparkles,
  Compass,
  ArrowLeft,
  Zap
} from "lucide-react";
import SearchBar from "./SearchBar";
import ProfileCard from "./ProfileCard";
import LanguageBreakdown from "./LanguageBreakdown";
import RepoList from "./RepoList";
import UsersGrid from "./UsersGrid";
import SkeletonLoader from "./SkeletonLoader";
import BookmarksModal from "./BookmarksModal";
import Toast from "./Toast";
import {
  fetchUserProfile,
  fetchUserRepos,
  searchUsers,
  FEATURED_DEVELOPERS
} from "../utils/githubApi";

const RECENT_KEY = "gitpulse_recent_searches";
const BOOKMARKS_KEY = "gitpulse_bookmarks";

function Body({ theme, isBookmarksOpen, setIsBookmarksOpen }) {
  const [searchMode, setSearchMode] = useState("user"); // "user" | "discover"
  const [activeUser, setActiveUser] = useState(null);
  const [userRepos, setUserRepos] = useState([]);
  const [discoveredUsers, setDiscoveredUsers] = useState([]);
  const [discoveryTitle, setDiscoveryTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  // LocalStorage state
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : ["PrakashChokhal", "torvalds", "gaearon", "shadcn"];
    } catch {
      return ["PrakashChokhal", "torvalds", "gaearon", "shadcn"];
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((username) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== username.toLowerCase());
      const updated = [username, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Remove single recent search
  const handleRemoveRecent = (term) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== term);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch (e) {}
    showToast("Cleared search history", "info");
  };

  // Toggle bookmark
  const handleToggleBookmark = () => {
    if (!activeUser) return;
    setBookmarks((prev) => {
      const exists = prev.some((u) => u.login.toLowerCase() === activeUser.login.toLowerCase());
      let updated;
      if (exists) {
        updated = prev.filter((u) => u.login.toLowerCase() !== activeUser.login.toLowerCase());
        showToast(`Removed @${activeUser.login} from bookmarks`, "info");
      } else {
        const snippet = {
          login: activeUser.login,
          name: activeUser.name,
          avatar_url: activeUser.avatar_url,
          html_url: activeUser.html_url
        };
        updated = [snippet, ...prev];
        showToast(`Saved @${activeUser.login} to bookmarks!`, "success");
      }
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleRemoveBookmark = (login) => {
    setBookmarks((prev) => {
      const updated = prev.filter((u) => u.login.toLowerCase() !== login.toLowerCase());
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`Removed @${login} from bookmarks`, "info");
  };

  const handleClearAllBookmarks = () => {
    setBookmarks([]);
    try {
      localStorage.removeItem(BOOKMARKS_KEY);
    } catch (e) {}
    showToast("All bookmarks cleared", "info");
  };

  // Copy Profile Link
  const handleCopyLink = () => {
    if (!activeUser) return;
    navigator.clipboard.writeText(activeUser.html_url);
    setCopied(true);
    showToast(`Copied @${activeUser.login}'s GitHub link!`, "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Main loader for single user
  const loadUserProfile = useCallback(
    async (username) => {
      if (!username || !username.trim()) return;
      setIsLoading(true);
      setError(null);
      setSearchMode("user");

      try {
        const [profileData, reposData] = await Promise.all([
          fetchUserProfile(username),
          fetchUserRepos(username)
        ]);

        setActiveUser(profileData);
        setUserRepos(reposData || []);
        saveRecentSearch(profileData.login);
      } catch (err) {
        setError(err.message || "Failed to load GitHub profile. Please check the username.");
        setActiveUser(null);
        setUserRepos([]);
      } finally {
        setIsLoading(false);
      }
    },
    [saveRecentSearch]
  );

  // Discover multiple users
  const loadDiscoveredUsers = useCallback(async (query) => {
    if (!query || !query.trim()) return;
    setIsLoading(true);
    setError(null);
    setSearchMode("discover");

    try {
      const results = await searchUsers(query, 1, 16);
      setDiscoveredUsers(results.items || []);
      setDiscoveryTitle(`Developers matching "${query}"`);
    } catch (err) {
      setError(err.message || "Failed to discover developers. Please try again.");
      setDiscoveredUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Main Search Handler
  const handleSearch = (query, mode) => {
    if (mode === "user") {
      loadUserProfile(query);
    } else {
      loadDiscoveredUsers(query);
    }
  };

  // Initial load
  useEffect(() => {
    const hash = window.location.hash.replace("#", "").trim();
    if (hash) {
      loadUserProfile(hash);
    } else {
      loadUserProfile("PrakashChokhal");
    }
  }, [loadUserProfile]);

  const isBookmarked =
    activeUser &&
    bookmarks.some((u) => u.login.toLowerCase() === activeUser.login.toLowerCase());

  return (
    <main className="app-main">
      <div className="main-container">
        {/* Search & Filter Header Section */}
        <SearchBar
          onSearch={handleSearch}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          recentSearches={recentSearches}
          onClearRecent={handleClearRecent}
          onRemoveRecent={handleRemoveRecent}
          isLoading={isLoading}
        />

        {/* Demo Mode Notice if Active */}
        {activeUser && activeUser.isDemoData && (
          <div className="demo-mode-badge-banner">
            <Zap size={16} className="demo-icon" />
            <span>
              <strong>Demo/Offline Mode:</strong> GitHub public IP rate limit is active. Showing pre-cached profile data for @{activeUser.login}.
            </span>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="error-banner">
            <AlertCircle size={22} className="error-icon" />
            <div className="error-content">
              <h3>Unable to fetch from GitHub API</h3>
              <p>{error}</p>
            </div>
            <button
              type="button"
              className="error-retry-btn"
              onClick={() => loadUserProfile("PrakashChokhal")}
            >
              <RefreshCw size={14} />
              <span>Load Prakash Chokhal Profile</span>
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <SkeletonLoader type={searchMode === "discover" ? "users" : "profile"} />}

        {/* User Direct Profile Mode */}
        {!isLoading && !error && searchMode === "user" && activeUser && (
          <div className="profile-dashboard animate-fade-in">
            <ProfileCard
              user={activeUser}
              repos={userRepos}
              isBookmarked={isBookmarked}
              onToggleBookmark={handleToggleBookmark}
              onCopyLink={handleCopyLink}
              copied={copied}
            />

            <LanguageBreakdown repos={userRepos} />

            <RepoList repos={userRepos} username={activeUser.login} />
          </div>
        )}

        {/* Discover / Multi-User Mode */}
        {!isLoading && !error && searchMode === "discover" && (
          <div className="discover-dashboard animate-fade-in">
            <div className="discovery-top-bar">
              <button
                type="button"
                className="back-to-profile-btn"
                onClick={() => setSearchMode("user")}
              >
                <ArrowLeft size={16} />
                <span>Back to Profile View</span>
              </button>
            </div>

            <UsersGrid
              users={discoveredUsers}
              onSelectUser={loadUserProfile}
              title={discoveryTitle}
              subtitle="Click on any developer card below to view their detailed profile, repositories, and analytics."
            />
          </div>
        )}

        {/* Featured Open Source Legends Bar (Footer Section) */}
        {!isLoading && searchMode === "user" && (
          <section className="featured-devs-section">
            <div className="featured-header">
              <div className="featured-title-wrap">
                <Compass size={20} className="section-icon" />
                <h2>Explore Featured Tech Leaders</h2>
              </div>
              <p className="featured-subtitle">
                Inspect key contributors shaping the global open source ecosystem
              </p>
            </div>

            <div className="featured-pills-grid">
              {FEATURED_DEVELOPERS.map((dev) => (
                <div
                  key={dev.username}
                  className={`featured-pill-card ${
                    activeUser && activeUser.login.toLowerCase() === dev.username.toLowerCase()
                      ? "active"
                      : ""
                  }`}
                  onClick={() => loadUserProfile(dev.username)}
                >
                  <img
                    src={`https://github.com/${dev.username}.png`}
                    alt={dev.name}
                    className="featured-avatar"
                  />
                  <div className="featured-info">
                    <span className="featured-name">{dev.name}</span>
                    <span className="featured-role">{dev.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectUser={loadUserProfile}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
      />

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}

export default Body;