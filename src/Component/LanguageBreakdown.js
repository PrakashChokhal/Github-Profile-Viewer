import React from "react";
import { Code2, BarChart2 } from "lucide-react";
import { getLanguageColor } from "../utils/helpers";

function LanguageBreakdown({ repos }) {
  if (!repos || repos.length === 0) return null;

  // Calculate language distribution
  const langCount = {};
  let totalWithLanguage = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      totalWithLanguage++;
    }
  });

  if (totalWithLanguage === 0) {
    return null;
  }

  // Sort languages by occurrence
  const sortedLanguages = Object.entries(langCount)
    .sort(([, a], [, b]) => b - a)
    .map(([lang, count]) => ({
      name: lang,
      count,
      percentage: ((count / totalWithLanguage) * 100).toFixed(1),
      color: getLanguageColor(lang)
    }));

  return (
    <div className="language-breakdown-card">
      <div className="card-header">
        <div className="card-title-wrap">
          <Code2 size={20} className="header-icon" />
          <h2 className="card-title">Top Languages & Tech Stack</h2>
        </div>
        <span className="card-subtitle">{sortedLanguages.length} Languages Detected</span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="language-progress-bar">
        {sortedLanguages.map((lang) => (
          <div
            key={lang.name}
            className="progress-segment"
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color
            }}
            title={`${lang.name}: ${lang.percentage}% (${lang.count} repos)`}
          />
        ))}
      </div>

      {/* Legend Grid */}
      <div className="language-legend-grid">
        {sortedLanguages.slice(0, 8).map((lang) => (
          <div key={lang.name} className="legend-item">
            <span
              className="color-dot"
              style={{ backgroundColor: lang.color }}
            />
            <span className="lang-name">{lang.name}</span>
            <span className="lang-percentage">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LanguageBreakdown;
