import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Header from "./Component/Header";
import Body from "./Component/Body";

const THEME_KEY = "gitpulse_theme";

function GithubProfile() {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme) return savedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "dark";
    }
  });

  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-root">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
      />
      <Body
        theme={theme}
        isBookmarksOpen={isBookmarksOpen}
        setIsBookmarksOpen={setIsBookmarksOpen}
      />
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Powered by <strong>GitHub REST API</strong> • Built with <strong>React 19</strong> & <strong>Parcel</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<GithubProfile />);
}