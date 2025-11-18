# React Frontend Setup Guide

## Installation Steps

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

This will install:
- React & React DOM
- React Router DOM
- React Bootstrap & Bootstrap
- Axios (for API calls)
- Vite (build tool)

3. **Start development server:**
```bash
npm run dev
```

The dev server will start on `http://localhost:3000`

4. **Build for production:**
```bash
npm run build
```

The build output will be in `../public/assets/js/react/`

## Project Structure

```
frontend/
├── src/
│   ├── app/              # App setup (Router, Providers)
│   ├── components/       # Reusable components
│   │   ├── layout/       # Header, Footer, Layout
│   │   ├── ui/          # UI building blocks
│   │   └── common/       # Common components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── hooks/            # Custom hooks
│   ├── context/          # React Context
│   ├── utils/            # Utility functions
│   └── styles/           # Global styles
├── public/               # Static assets
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Begin migrating CI4 views to React components
4. Set up CI4 API endpoints for data fetching

