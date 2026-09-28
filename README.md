# GitPulse — GitHub Developer Profile & Repository Analytics

A modern, responsive web application for inspecting GitHub developer profiles, analyzing programming language distributions, filtering repositories, and discovering top open source creators.

---

## ✨ Features

- **🔍 Dual Search Modes**:
  - **Direct Username Lookup**: Instant analysis of any public GitHub user (e.g., `torvalds`, `gaearon`, `shadcn`).
  - **Developer Discovery**: Search users across GitHub by name, bio, or skill keyword (e.g., `React`, `Rust`, `AI`).
- **📊 Tech Stack & Language Visualizer**:
  - Automatically calculates language distribution percentages across all public repositories with official GitHub language color indicators.
- **📁 Advanced Repository Explorer**:
  - Real-time search filter by repository name or description.
  - Sort repositories by **Most Stars**, **Most Forks**, **Recently Updated**, or **Name**.
  - Filter by **Source repositories** vs **Forks**.
  - Direct links to live deployment sites and GitHub source pages.
- **📌 Bookmarks & Saved Profiles**:
  - Save favorite developers to local storage for quick access.
- **🕒 Search History**:
  - Stores recent searches locally with single-item removal and quick re-search.
- **🌓 Dark & Light Mode**:
  - Sleek glassmorphism theme with automatic system preference detection and smooth toggle.
- **⚡ Shimmer Skeleton Loaders**:
  - Polished loading states to eliminate layout shifts.
- **🛡️ Rate Limit & Error Handling**:
  - Clear user feedback and error recovery when rate limits or invalid usernames are encountered.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, JavaScript (ES6+), Modern HTML5
- **Styling**: Vanilla CSS3 (Custom Properties, Glassmorphism, CSS Grid & Flexbox)
- **Icons**: Lucide Icons
- **Bundler**: Parcel
- **API**: GitHub REST API v3

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PrakashChokhal/Github-Profile-Viewer.git
   cd Github-Profile-Viewer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** at `http://localhost:1234`.

---

## 📦 Building for Production

To generate an optimized production build:

```bash
npm run build
```

The output files will be created in the `dist/` directory.

---

## 📄 License

This project is licensed under the ISC License.
