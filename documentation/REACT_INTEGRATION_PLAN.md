# React.js Integration Plan for CI4 Project

## Overview
Integrate React.js as a Single Page Application (SPA) frontend while keeping CodeIgniter 4 as the backend API. This will enable client-side routing to avoid reloading navigation, footer, and other reusable components.

## Folder Structure

```
unnatva.org/
├─ app/                    # CI4 Application (unchanged)
├─ frontend/               # React Application
│  ├─ src/
│  │  ├─ app/             # App-wide setup (providers, routing, global styles)
│  │  │  ├─ App.jsx
│  │  │  ├─ Router.jsx
│  │  │  └─ providers.jsx
│  │  ├─ components/      # Reusable, presentational components
│  │  │  ├─ ui/           # Low-level UI building blocks
│  │  │  ├─ layout/       # Layout components (Header, Footer, etc.)
│  │  │  └─ common/       # Common reusable components
│  │  ├─ pages/            # Page-level components (route components)
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ AboutPage.jsx
│  │  │  ├─ ContactPage.jsx
│  │  │  ├─ ImpactPage.jsx
│  │  │  ├─ InitiativesPage.jsx
│  │  │  ├─ SuccessStoriesPage.jsx
│  │  │  └─ MediaPage.jsx
│  │  ├─ features/         # Feature-specific components & logic (optional)
│  │  │  ├─ initiatives/   # Only if initiatives has complex sub-features
│  │  │  │  ├─ components/  # Initiative-specific components
│  │  │  │  └─ hooks/       # Initiative-specific hooks
│  │  ├─ hooks/            # App-wide reusable hooks
│  │  ├─ context/          # App-wide contexts
│  │  ├─ services/          # Cross-feature API clients, adapters
│  │  ├─ utils/             # Pure helpers (formatters, validators)
│  │  ├─ assets/            # Images, fonts (will reference public/)
│  │  ├─ styles/            # Global CSS/SCSS
│  │  ├─ index.jsx          # Entry point
│  │  └─ setupTests.js      # Jest/RTL setup (if needed)
│  ├─ public/               # React public assets (temporary build files)
│  ├─ dist/                 # Build output (will copy to public/)
│  ├─ .env                  # React environment variables
│  ├─ package.json
│  ├─ vite.config.js        # Vite configuration
│  └─ index.html            # React entry HTML
├─ public/                  # CI4 Public directory
│  ├─ assets/
│  │  ├─ css/              # Existing CSS
│  │  └─ js/
│  │     └─ react/         # Built React app will go here
│  ├─ img/                  # Images
│  └─ index.php             # CI4 entry point
└─ assets/                   # Source SCSS (unchanged)
```

## Architecture

### Frontend (React SPA)
- **Routing**: React Router for client-side navigation
- **UI Framework**: react-bootstrap (replacing vanilla Bootstrap)
- **State Management**: React Context API (or Redux if needed later)
- **API Communication**: Native `fetch` API with Promises (no Axios) - see [REACT_API_ARCHITECTURE.md](./REACT_API_ARCHITECTURE.md)
- **Build Tool**: Vite (fast, modern)
- **Future CMS**: Architecture designed for database-driven content via API

### Backend (CI4)
- **API Endpoints**: New API controllers to serve JSON data
- **Views**: Modified to serve React app HTML shell
- **Routes**: API routes + catch-all route for React Router

## Implementation Steps

### Phase 1: Setup
1. ✅ Create `frontend/` folder structure
2. Initialize React with Vite
3. Install dependencies (React, React Router, react-bootstrap, axios)
4. Configure Vite to build to `public/assets/js/react/`

### Phase 2: Core Components
1. Convert CI4 Header to React component
2. Convert CI4 Footer to React component
3. Create Layout wrapper component
4. Set up React Router with routes

### Phase 3: Page Components
1. Convert each CI4 view to React page component in `pages/`:
   - HomePage
   - AboutPage
   - ContactPage
   - ImpactPage
   - InitiativesPage (with sub-routes)
   - SuccessStoriesPage
   - MediaPage
   - PrivacyPolicyPage

### Phase 4: API Integration
1. Create CI4 API controllers (see [REACT_API_ARCHITECTURE.md](./REACT_API_ARCHITECTURE.md))
2. Create React API service layer using native `fetch` API and Promises
3. Replace static content with API calls where needed
4. **Future**: Integrate CMS database for dynamic content

### Phase 5: Styling
1. Replace Bootstrap components with react-bootstrap
2. Ensure SCSS compilation still works
3. Integrate existing custom styles

### Phase 6: Testing & Optimization
1. Test all routes
2. Optimize bundle size
3. Add loading states
4. Error handling

## Key Decisions

1. **Folder Naming**: Using `frontend/` instead of `src/` at root to avoid confusion
2. **Build Output**: React builds to `public/assets/js/react/` to integrate with existing structure
3. **API Strategy**: CI4 serves both the React app HTML and API endpoints
4. **Styling**: Keep existing SCSS compilation, integrate with React components
5. **Migration**: Gradual - can run both old and new side-by-side during transition

## Benefits

1. ✅ No page reloads - only content area updates
2. ✅ Better user experience with smooth transitions
3. ✅ Reusable components across pages
4. ✅ Modern React ecosystem
5. ✅ CI4 remains as robust backend
6. ✅ Can gradually migrate pages

