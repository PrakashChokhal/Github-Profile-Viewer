import { MOCK_USERS, MOCK_REPOS } from "./mockData";

const BASE_URL = "https://api.github.com";

export async function fetchUserProfile(username) {
  const cleanUsername = username.trim();
  if (!cleanUsername) throw new Error("Please enter a valid GitHub username");

  const lowerUsername = cleanUsername.toLowerCase();
  const mockMatchKey = Object.keys(MOCK_USERS).find((k) => k.toLowerCase() === lowerUsername);

  try {
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(cleanUsername)}`);

    if (response.status === 404) {
      throw new Error(`User "${cleanUsername}" was not found on GitHub.`);
    }

    if (response.status === 403) {
      if (mockMatchKey) {
        return { ...MOCK_USERS[mockMatchKey], isDemoData: true };
      }
      throw new Error(
        "GitHub API public rate limit reached for this IP (60 req/hr). Loaded in Demo Mode. Please try again shortly or search featured profiles."
      );
    }

    if (!response.ok) {
      if (mockMatchKey) return { ...MOCK_USERS[mockMatchKey], isDemoData: true };
      throw new Error(`Failed to load profile (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (err) {
    if (mockMatchKey) {
      return { ...MOCK_USERS[mockMatchKey], isDemoData: true };
    }
    throw err;
  }
}

export async function fetchUserRepos(username) {
  const cleanUsername = username.trim();
  const lowerUsername = cleanUsername.toLowerCase();
  const mockMatchKey = Object.keys(MOCK_REPOS).find((k) => k.toLowerCase() === lowerUsername);

  try {
    const response = await fetch(
      `${BASE_URL}/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`
    );

    if (response.ok) {
      return await response.json();
    }

    if (mockMatchKey) {
      return MOCK_REPOS[mockMatchKey];
    }
    return [];
  } catch (err) {
    if (mockMatchKey) {
      return MOCK_REPOS[mockMatchKey];
    }
    return [];
  }
}

export async function searchUsers(query, page = 1, perPage = 12) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return { items: [], total_count: 0 };

  try {
    const response = await fetch(
      `${BASE_URL}/search/users?q=${encodeURIComponent(cleanQuery)}&page=${page}&per_page=${perPage}`
    );

    if (response.status === 403) {
      // Filter from mock users as friendly fallback
      const matchingMocks = Object.values(MOCK_USERS).filter(
        (u) =>
          u.login.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          (u.name && u.name.toLowerCase().includes(cleanQuery.toLowerCase())) ||
          (u.bio && u.bio.toLowerCase().includes(cleanQuery.toLowerCase()))
      );
      if (matchingMocks.length > 0) {
        return { items: matchingMocks, total_count: matchingMocks.length };
      }
      throw new Error("GitHub API search rate limit reached. Please wait a moment before searching again.");
    }

    if (!response.ok) {
      throw new Error(`Search failed (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (err) {
    const matchingMocks = Object.values(MOCK_USERS).filter(
      (u) =>
        u.login.toLowerCase().includes(cleanQuery.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(cleanQuery.toLowerCase()))
    );
    if (matchingMocks.length > 0) {
      return { items: matchingMocks, total_count: matchingMocks.length };
    }
    throw err;
  }
}

export const FEATURED_DEVELOPERS = [
  { username: "PrakashChokhal", name: "Prakash Chokhal", role: "Developer & Creator" },
  { username: "torvalds", name: "Linus Torvalds", role: "Creator of Linux & Git" },
  { username: "gaearon", name: "Dan Abramov", role: "Co-author of Redux & React Core" },
  { username: "yyx990803", name: "Evan You", role: "Creator of Vue.js & Vite" },
  { username: "shadcn", name: "shadcn", role: "Creator of shadcn/ui" },
  { username: "antfu", name: "Anthony Fu", role: "Vue / Vite / Nuxt Core Team" },
  { username: "rich-harris", name: "Rich Harris", role: "Creator of Svelte & Rollup" },
  { username: "sindresorhus", name: "Sindre Sorhus", role: "Open Source Contributor" },
  { username: "tj", name: "TJ Holowaychuk", role: "Creator of Express & Commander" },
  { username: "kentcdodds", name: "Kent C. Dodds", role: "Creator of Testing Library" }
];
