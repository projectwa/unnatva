# UNNATVA Frontend - React App

This is the React frontend application for UNNATVA Foundation website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

The build output will be in `../public/assets/js/react/`

## Project Structure

- `src/app/` - App-wide setup (routing, providers)
- `src/components/` - Reusable components
- `src/pages/` - Page components
- `src/services/` - API services
- `src/styles/` - Global styles

## Development

The dev server runs on port 3000 and proxies API requests to `http://lhunnatva/api`

