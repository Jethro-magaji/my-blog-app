module.exports = {
  reactStrictMode: true, // (Optional, but recommended for strict mode)
  // ... your other Next.js configurations
  exportPathMap: () => ({
    '/': { page: '/login' }, // Redirect root to login.js
    '/dashboard': { page: '/dashboard' }
  }),
};