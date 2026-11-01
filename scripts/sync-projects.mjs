// Pulls public repos tagged "portfolio" that have a live website URL set,
// and writes them to data/projects.json. Repo URLs are never stored.

import { mkdir, writeFile } from "node:fs/promises";

const USER = process.env.GITHUB_USER || "Gbenga-ayo01";
const TOKEN = process.env.GITHUB_TOKEN;
const TOPIC = "portfolio";

// Display order on the site. Repos not listed here come after, newest first.
const ORDER = ["Abu", "Adeluxe", "Aura-atelier-demo"];

function isHttps(value) {
  try {
    return new URL(String(value).trim()).protocol === "https:";
  } catch {
    return false;
  }
}

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "g33by-portfolio-sync",
};
if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

const res = await fetch(
  `https://api.github.com/users/${encodeURIComponent(USER)}/repos?per_page=100&type=owner&sort=updated`,
  { headers }
);

if (!res.ok) {
  throw new Error(`GitHub API returned ${res.status}`);
}

const repos = await res.json();

const projects = repos
  .filter(
    (r) =>
      !r.fork &&
      !r.private &&
      Array.isArray(r.topics) &&
      r.topics.includes(TOPIC) &&
      isHttps(r.homepage)
  )
  .map((r) => ({
    repo: r.name,
    homepage: r.homepage.trim(),
    description: r.description || "",
  }))
  .sort((a, b) => {
    const ia = ORDER.indexOf(a.repo);
    const ib = ORDER.indexOf(b.repo);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

await mkdir("data", { recursive: true });
await writeFile("data/projects.json", JSON.stringify({ projects }, null, 2) + "\n");

console.log(`Wrote ${projects.length} project(s).`);
