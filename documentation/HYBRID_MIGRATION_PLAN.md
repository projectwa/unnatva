# Hybrid Approach Migration Plan

## Overview
Switching from Full React SPA to Hybrid Approach:
- **Public Pages**: CI4 Views + Embedded React Components
- **Admin/CMS**: Full React SPA (to be built)

## Architecture

### Public Pages Structure
```
app/Views/
├── home/index.php          ← Server-rendered HTML
├── about/index.php         ← Server-rendered HTML
├── contact/index.php       ← Server-rendered HTML
└── ... (all public pages)

public/js/react/
├── components/
│   ├── carousel.js         ← Individual React component bundle
│   ├── counters.js         ← Individual React component bundle
│   ├── forms.js            ← Individual React component bundle
│   └── ... (other components)
```

### Admin/CMS Structure (Future)
```
app/Controllers/Admin/
└── Dashboard.php            ← Serves React SPA

public/admin/                ← React SPA for admin
```

## Migration Steps

### Phase 1: Setup Component Build System
1. ✅ Configure Vite to build individual components
2. ✅ Create component entry points
3. ✅ Update build scripts

### Phase 2: Extract React Components
1. Extract carousel component from HomePage
2. Extract counter component from HomePage
3. Extract form components
4. Extract other interactive components

### Phase 3: Update CI4 Views
1. Keep existing CI4 views (they're already there)
2. Add React component mounting points
3. Include component scripts
4. Pass data to components via data attributes

### Phase 4: Update Build Process
1. Build individual components
2. Copy to public/js/react/components/
3. Update CI4 views to reference components

### Phase 5: Test & Refine
1. Test each page with embedded components
2. Ensure SEO is maintained
3. Verify interactivity works

## Benefits
- ✅ Perfect SEO (server-rendered HTML)
- ✅ React for interactivity
- ✅ Simpler than full SPA
- ✅ Best of both worlds

