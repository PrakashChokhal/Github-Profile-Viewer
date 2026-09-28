import React from "react";
import {
  MapPin,
  Building,
  Link as LinkIcon,
  Calendar,
  ExternalLink,
  Bookmark,
  Share2,
  Check,
  Star,
  Users,
  FolderGit2,
  FileCode2,
  Sparkles
} from "lucide-react";
import { TwitterIcon } from "./Icons";
import { formatDate, formatNumber } from "../utils/helpers";

function ProfileCard({
  user,
  repos,
  isBookmarked,
  onToggleBookmark,
  onCopyLink,
  copied
}) {
  if (!user) return null;

  // Calculate total stars earned across public repos
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

  // Format blog URL
  let blogUrl = user.blog;
  if (blogUrl && !blogUrl.startsWith("http://") && !blogUrl.startsWith("https://")) {
    blogUrl = `https://${blogUrl}`;
  }

  return (
    <div className="profile-card">
      <div className="profile-header-banner">
        <div className="banner-pattern" />
      </div>

      <div className="profile-body">
        <div className="profile-avatar-row">
          <div className="avatar-container">
            <img src={user.avatar_url} alt={user.login} className="profile-avatar" />
            {user.hireable && (
              <div className="hireable-badge" title="Open to opportunities">
                <Sparkles size={12} />
                <span>Available</span>
              </div>
            )}
          </div>

          <div className="profile-quick-actions">
            <button
              className={`profile-action-btn ${isBookmarked ? "bookmarked" : ""}`}
              onClick={onToggleBookmark}
              title={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
            >
              <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button
              className="profile-action-btn"
              onClick={onCopyLink}
              title="Copy profile link"
            >
              {copied ? <Check size={18} className="text-success" /> : <Share2 size={18} />}
            </button>
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="view-github-btn"
            >
              <span>View GitHub</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        <div className="profile-info">
          <div className="name-container">
            <h1 className="profile-name">{user.name || user.login}</h1>
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="profile-username"
            >
              @{user.login}
            </a>
          </div>

          {user.bio ? (
            <p className="profile-bio">{user.bio}</p>
          ) : (
            <p className="profile-bio bio-empty">No bio provided by this developer.</p>
          )}

          {/* Key Stats Bar */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrap repos">
                <FolderGit2 size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatNumber(user.public_repos)}</span>
                <span className="stat-label">Repositories</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap stars">
                <Star size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatNumber(totalStars)}</span>
                <span className="stat-label">Total Stars</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap followers">
                <Users size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatNumber(user.followers)}</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap following">
                <Users size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatNumber(user.following)}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap gists">
                <FileCode2 size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{formatNumber(user.public_gists)}</span>
                <span className="stat-label">Gists</span>
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="meta-grid">
            {user.location && (
              <div className="meta-item">
                <MapPin size={16} className="meta-icon" />
                <span>{user.location}</span>
              </div>
            )}

            {user.company && (
              <div className="meta-item">
                <Building size={16} className="meta-icon" />
                <span>{user.company}</span>
              </div>
            )}

            {user.blog && (
              <div className="meta-item">
                <LinkIcon size={16} className="meta-icon" />
                <a href={blogUrl} target="_blank" rel="noreferrer" className="meta-link">
                  {user.blog.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            {user.twitter_username && (
              <div className="meta-item">
                <TwitterIcon size={16} className="meta-icon" />
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="meta-link"
                >
                  @{user.twitter_username}
                </a>
              </div>
            )}

            <div className="meta-item">
              <Calendar size={16} className="meta-icon" />
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
