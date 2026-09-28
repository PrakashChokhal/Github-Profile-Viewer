import React from "react";
import { X, Trash2, ArrowRight, Bookmark, ExternalLink } from "lucide-react";

function BookmarksModal({ isOpen, onClose, bookmarks, onSelectUser, onRemoveBookmark, onClearAll }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Bookmark size={20} className="modal-icon" />
            <h2>Saved Developers</h2>
            <span className="modal-badge">{bookmarks.length}</span>
          </div>

          <div className="modal-header-actions">
            {bookmarks.length > 0 && (
              <button type="button" className="clear-all-btn" onClick={onClearAll}>
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
            <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {bookmarks.length === 0 ? (
            <div className="modal-empty-state">
              <Bookmark size={40} className="empty-icon" />
              <h3>No Bookmarks Yet</h3>
              <p>Click the bookmark icon on any developer profile to save them here for quick access.</p>
            </div>
          ) : (
            <div className="bookmarks-list">
              {bookmarks.map((user) => (
                <div key={user.login} className="bookmark-item">
                  <div
                    className="bookmark-user-info"
                    onClick={() => {
                      onSelectUser(user.login);
                      onClose();
                    }}
                  >
                    <img src={user.avatar_url} alt={user.login} className="bookmark-avatar" />
                    <div>
                      <h4 className="bookmark-name">{user.name || user.login}</h4>
                      <p className="bookmark-username">@{user.login}</p>
                    </div>
                  </div>

                  <div className="bookmark-item-actions">
                    <button
                      type="button"
                      className="bookmark-inspect-btn"
                      onClick={() => {
                        onSelectUser(user.login);
                        onClose();
                      }}
                      title="Inspect profile"
                    >
                      <ArrowRight size={16} />
                    </button>
                    <button
                      type="button"
                      className="bookmark-remove-btn"
                      onClick={() => onRemoveBookmark(user.login)}
                      title="Remove bookmark"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookmarksModal;
