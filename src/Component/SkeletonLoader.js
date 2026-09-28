import React from "react";

function SkeletonLoader({ type = "profile" }) {
  if (type === "users") {
    return (
      <div className="skeleton-users-grid">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="skeleton-user-card shimmer">
            <div className="skeleton-avatar" />
            <div className="skeleton-line title" />
            <div className="skeleton-line subtitle" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-container">
      {/* Profile Card Skeleton */}
      <div className="skeleton-profile-card shimmer">
        <div className="skeleton-banner" />
        <div className="skeleton-body">
          <div className="skeleton-avatar-large" />
          <div className="skeleton-line title-large" />
          <div className="skeleton-line subtitle" />
          <div className="skeleton-line bio-line" />
          <div className="skeleton-line bio-line short" />

          <div className="skeleton-stats-grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-stat-box" />
            ))}
          </div>
        </div>
      </div>

      {/* Language Skeleton */}
      <div className="skeleton-lang-card shimmer">
        <div className="skeleton-line title" />
        <div className="skeleton-progress-bar" />
        <div className="skeleton-legend-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-legend-item" />
          ))}
        </div>
      </div>

      {/* Repos Grid Skeleton */}
      <div className="skeleton-repos-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-repo-card shimmer">
            <div className="skeleton-line title" />
            <div className="skeleton-line bio-line" />
            <div className="skeleton-line bio-line short" />
            <div className="skeleton-meta-row" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonLoader;
