const BASE_URL = "https://api.github.com";

export async function fetchUserProfile(username) {
  const cleanUsername = username.trim();
  if (!cleanUsername) throw new Error("Please enter a valid GitHub username");

  const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(cleanUsername)}`);
  
  if (response.status === 404) {
    throw new Error(`User "${cleanUsername}" was not found on GitHub.`);
  }

  if (response.status === 403) {
    const rateLimitReset = response.headers.get("X-RateLimit-Reset");
    const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : "soon";
    throw new Error(`GitHub API rate limit exceeded. Resets at ${resetTime}. Please try again later.`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch user (HTTP ${response.status})`);
  }

  return await response.json();
}

export async function fetchUserRepos(username) {
  const cleanUsername = username.trim();
  const response = await fetch(
    `${BASE_URL}/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`
  );

  if (!response.ok) {
    if (response.status === 404) return [];
    if (response.status === 403) throw new Error("GitHub API rate limit exceeded");
    return [];
  }

  return await response.json();
}

export async function searchUsers(query, page = 1, perPage = 12) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return { items: [], total_count: 0 };

  const response = await fetch(
    `${BASE_URL}/search/users?q=${encodeURIComponent(cleanQuery)}&page=${page}&per_page=${perPage}`
  );

  if (response.status === 403) {
    throw new Error("GitHub API rate limit exceeded for search. Please wait a moment.");
  }

  if (!response.ok) {
    throw new Error(`Search failed (HTTP ${response.status})`);
  }

  return await response.json();
}

export const FEATURED_DEVELOPERS = [
  { username: "torvalds", name: "Linus Torvalds", role: "Creator of Linux & Git" },
  { username: "gaearon", name: "Dan Abramov", role: "Co-author of Redux & Create React App" },
  { username: "yyx990803", name: "Evan You", role: "Creator of Vue.js & Vite" },
  { username: "shadcn", name: "shadcn", role: "Creator of shadcn/ui" },
  { username: "antfu", name: "Anthony Fu", role: "Vue / Vite / Nuxt Core Team" },
  { username: "rich-harris", name: "Rich Harris", role: "Creator of Svelte & Rollup" },
  { username: "sindresorhus", name: "Sindre Sorhus", role: "Open Source Contributor" },
  { username: "tj", name: "TJ Holowaychuk", role: "Creator of Express & Commander" },
  { username: "kentcdodds", name: "Kent C. Dodds", role: "Creator of Testing Library" },
  { username: "PrakashChokhal", name: "Prakash Chokhal", role: "Developer & Creator" }
];
