# Assets Structure Documentation

## Overview

The website now uses a modern SCSS build process that compiles Bootstrap and custom styles into a single `custom.css` file.

## File Structure

```
assets/
├── css/
│   └── custom.css          # Compiled CSS (Bootstrap + Custom styles)
├── js/                     # Custom JavaScript files (future)
└── scss/
    ├── custom.scss         # Main SCSS entry point
    ├── base/               # Base styles (body, typography, links, utilities)
    ├── components/          # Reusable components (buttons, navbar, carousel, etc.)
    ├── layout/             # Layout styles (sections, footer)
    ├── pages/              # Page-specific styles
    └── overrides/          # Third-party library overrides
```

## Build Process

### Development

1. **Watch mode** (auto-compile on save):
   ```bash
   npm run watch:css
   ```

2. **One-time build** (development):
   ```bash
   npm run build:css
   ```

### Production

```bash
npm run build
```

This creates a minified, production-ready CSS file without source maps.

## What Changed

### Before
- `css/bootstrap.min.css` (160 KB) - Bootstrap framework
- `css/usedstyle-minified.css` (31 KB) - Custom styles
- **Total: 2 CSS files, ~191 KB**

### After
- `assets/css/custom.css` (319 KB) - Bootstrap + Custom styles combined
- **Total: 1 CSS file, ~319 KB**

### Benefits

1. **Single file**: One CSS file instead of two
2. **Organized SCSS**: Modular structure for easier maintenance
3. **Bootstrap integration**: Uses Bootstrap from `node_modules` with custom variable overrides
4. **Build process**: Easy to compile and minify
5. **Better organization**: Styles organized by component, page, and layout

## Bootstrap Variables

Custom Bootstrap variables are defined in `assets/scss/custom.scss`:

```scss
$primary: #005a3e;
$secondary: #00a470;
$light: #f3f6f8;
$dark: #0c2b4b;
$font-family-base: 'Roboto', sans-serif;
```

These override Bootstrap's default values before Bootstrap is imported.

## Adding New Styles

### Component Styles
Add to `assets/scss/components/_your-component.scss` and import in `custom.scss`

### Page Styles
Add to `assets/scss/pages/_your-page.scss` and import in `custom.scss`

### Utilities
Add to `assets/scss/base/_utilities.scss`

## Updating Styles

1. Edit the appropriate SCSS file in `assets/scss/`
2. Run `npm run build` to compile
3. The changes will be in `assets/css/custom.css`

## File Locations

- **Source files**: `assets/scss/`
- **Compiled CSS**: `assets/css/custom.css`
- **Build scripts**: `package.json`

## Notes

- The compiled CSS includes Bootstrap 5.3.8 from `node_modules`
- All custom styles from `usedstyle-minified.css` have been preserved
- The website now uses only `assets/css/custom.css` (no more `bootstrap.min.css` or `usedstyle-minified.css`)
- Deprecation warnings from Bootstrap's SCSS are normal and don't affect functionality

