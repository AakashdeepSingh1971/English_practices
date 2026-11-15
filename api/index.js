// Vercel Node.js function. vercel.json rewrites every /api/* request here and
// Express handles it with its usual routes. The backend is compiled to
// backend/dist by the build step; the website itself is served by Vercel's CDN.
const { app } = require("../backend/dist/app");

module.exports = (req, res) => {
  // Vercel normally passes the original URL (/api/auth/login). If a request
  // ever arrives as the rewrite destination instead (/api?path=auth/login),
  // rebuild the original path so the Express routes still match.
  if (!req.url.startsWith("/api/")) {
    const url = new URL(req.url, "http://localhost");
    const path = url.searchParams.get("path");
    if (path !== null) {
      url.searchParams.delete("path");
      req.url = `/api/${path}${url.search}`;
    }
  }
  return app(req, res);
};
