# Dev Server Fix

## Issue
The dev server was redirecting to `/assets/js/react/` because the `base` path was set for production.

## Fix Applied
Updated `vite.config.js` to use:
- **Development**: `base: '/'` (serves from root)
- **Production**: `base: '/assets/js/react/'` (for CI4 integration)

## Steps to Fix

1. **Stop the current dev server** (Ctrl+C)

2. **Restart the dev server:**
```bash
npm run dev
```

3. **Access the app:**
- Should now work at `http://localhost:3000` without redirects
- The app should load correctly

## What Changed

The `vite.config.js` now conditionally sets the base path:
- Development mode: serves from `/` (root)
- Production mode: builds with `/assets/js/react/` base path (for CI4)

This allows:
- ✅ Normal development experience (no redirects)
- ✅ Production builds work correctly with CI4

