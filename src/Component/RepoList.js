import React, { useState, useMemo } from "react";
import {
  FolderGit2,
  Star,
  GitFork,
  ExternalLink,
  Search,
  SlidersHorizontal,
  Globe,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { formatNumber, formatRelativeTime, getLanguageColor } from "../utils/helpers";

function RepoList({ repos, username }) {
  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState("stars"); // "stars", "forks", "updated", "name"
  const [typeFilter, setTypeFilter] = useState("all"); // "all", "source", "fork"
  const [visibleCount, setVisibleCount] = useState(8);

  // Filter & sort repositories
  const filteredAndSortedRepos = useMemo(() => {
    if (!repos) return [];

    return repos
      .filter((repo) => {
        // Search term filter
        const matchesSearch =
          repo.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          (repo.description &&
            repo.description.toLowerCase().includes(searchFilter.toLowerCase())) ||
          (repo.language &&
            repo.language.toLowerCase().includes(searchFilter.toLowerCase()));

        // Type filter
        if (typeFilter === "source" && repo.fork) return false;
        if (typeFilter === "fork" && !repo.fork) return false;

        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "stars") return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        if (sortBy === "forks") return (b.forks_count || 0) - (a.forks_count || 0);
        if (sortBy === "updated") return new Date(b.updated_at) - new Date(a.updated_at);
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [repos, searchFilter, sortBy, typeFilter]);

  if (!repos || repos.length === 0) {
    return (
      <div className="repos-section empty-state">
        <FolderGit2 size={36} className="empty-icon" />
        <h3>No Public Repositories Found</h3>
        <p>This developer doesn't have any public repositories yet.</p>
      </div>
    );
  }

  const displayedRepos = filteredAndSortedRepos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedRepos.length;

  return (
    <div className="repos-section">
      <div className="repos-header">
        <div className="repos-title-wrap">
          <FolderGit2 size={22} className="header-icon" />
          <h2 className="repos-title">Repositories</h2>
          <span className="repos-counter">({filteredAndSortedRepos.length})</span>
        </div>

        {/* Filter Controls Bar */}
        <div className="repos-controls">
          <div className="repo-search-input-wrap">
            <Search size={16} className="input-icon" />
            <input
              type="text"
              placeholder="Find a repository..."
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setVisibleCount(8);
              }}
              className="repo-search-input"
            />
          </div>

          <div className="controls-group">
            {/* Type selector */}
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${typeFilter === "all" ? "active" : ""}`}
                onClick={() => setTypeFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`type-btn ${typeFilter === "source" ? "active" : ""}`}
                onClick={() => setTypeFilter("source")}
              >
                Sources
              </button>
              <button
                type="button"
                className={`type-btn ${typeFilter === "fork" ? "active" : ""}`}
                onClick={() => setTypeFilter("fork")}
              >
                Forks
              </button>
            </div>

            {/* Sort selector */}
            <div className="sort-select-wrap">
              <SlidersHorizontal size={14} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="stars">Most Stars</option>
                <option value="forks">Most Forks</option>
                <option value="updated">Recently Updated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {displayedRepos.length === 0 ? (
        <div className="no-repos-match">
          <p>No repositories match your filter "{searchFilter}".</p>
          <button
            type="button"
            className="reset-filter-btn"
            onClick={() => {
              setSearchFilter("");
              setTypeFilter("all");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="repos-grid">
          {displayedRepos.map((repo) => (
            <div key={repo.id} className="repo-card">
              <div className="repo-card-top">
                <div className="repo-name-wrap">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-name"
                  >
                    <span>{repo.name}</span>
                    <ArrowUpRight size={14} className="hover-arrow" />
                  </a>
                  <span className={`repo-badge ${repo.fork ? "fork-badge" : "public-badge"}`}>
                    {repo.fork ? "Fork" : "Public"}
                  </span>
                </div>

                {repo.description && (
                  <p className="repo-desc" title={repo.description}>
                    {repo.description}
                  </p>
                )}
              </div>

              <div className="repo-card-bottom">
                <div className="repo-meta-items">
                  {repo.language && (
                    <div className="repo-lang">
                      <span
                        className="color-dot"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      <span className="lang-text">{repo.language}</span>
                    </div>
                  )}

                  {repo.stargazers_count > 0 && (
                    <div className="repo-stat" title={`${repo.stargazers_count} stars`}>
                      <Star size={14} className="stat-star" />
                      <span>{formatNumber(repo.stargazers_count)}</span>
                    </div>
                  )}

                  {repo.forks_count > 0 && (
                    <div className="repo-stat" title={`${repo.forks_count} forks`}>
                      <GitFork size={14} />
                      <span>{formatNumber(repo.forks_count)}</span>
                    </div>
                  )}

                  <div className="repo-time" title={`Updated on ${new Date(repo.updated_at).toLocaleString()}`}>
                    <Clock size={13} />
                    <span>{formatRelativeTime(repo.updated_at)}</span>
                  </div>
                </div>

                <div className="repo-card-actions">
                  {repo.homepage && (
                    <a
                      href={repo.homepage.startsWith("http") ? repo.homepage : `https://${repo.homepage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="repo-action-icon-btn"
                      title="Live Demo / Website"
                    >
                      <Globe size={15} />
                    </a>
                  )}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-action-icon-btn"
                    title="Open on GitHub"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show More Button */}
      {hasMore && (
        <div className="load-more-container">
          <button
            type="button"
            className="load-more-btn"
            onClick={() => setVisibleCount((prev) => prev + 8)}
          >
            Show More Repositories ({filteredAndSortedRepos.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

export default RepoList;
