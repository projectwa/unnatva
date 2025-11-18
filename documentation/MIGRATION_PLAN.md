# CodeIgniter 4 Migration Plan

## Overview
This document outlines the migration of the Unnatva website from plain PHP to CodeIgniter 4.

## Current Structure
- Root-level PHP files (index.php, about/index.php, etc.)
- `includes/` folder with shared components (config.php, head.php, header.php, footer.php)
- Uses constants like `S_DOMAINPATH`, `S_IMGPATH`, `S_INCLUDESPATH` for paths
- Each page is a separate PHP file

## Target CI4 Structure
```
app/
├── Config/
│   ├── App.php (baseURL configuration)
│   ├── Routes.php (all routes)
│   └── Paths.php
├── Controllers/
│   ├── BaseController.php
│   ├── Home.php
│   ├── About.php
│   ├── Contact.php
│   ├── Impact.php
│   ├── SuccessStories.php
│   └── Initiatives.php (for entrepreneurship-development, skill-development, etc.)
├── Views/
│   ├── layouts/
│   │   ├── head.php (from includes/head.php)
│   │   ├── header.php (from includes/header.php)
│   │   └── footer.php (from includes/footer.php)
│   ├── home/
│   │   └── index.php (from index.php)
│   ├── about/
│   │   └── index.php (from about/index.php)
│   └── ... (other pages)
└── Helpers/
    └── site_helper.php (replaces includes/config.php)

public/
└── index.php (CI4 entry point)

writable/ (already created)
vendor/ (CI4 framework)
```

## Migration Steps

### 1. ✅ Install CI4 Framework
- Install via Composer: `composer require codeigniter4/framework`
- Framework files will be in `vendor/codeigniter4/framework/`

### 2. Create CI4 Configuration
- Create `app/Config/App.php` with baseURL based on server detection
- Create `app/Config/Paths.php`
- Create `app/Config/Routes.php` with all routes
- Create `.env` file for environment-specific settings

### 3. Create Helper for Path Constants
- Create `app/Helpers/site_helper.php` to replace `includes/config.php`
- Functions: `base_url()`, `img_path()`, `css_path()`, `js_path()`

### 4. Convert Includes to Views
- Move `includes/head.php` → `app/Views/layouts/head.php`
- Move `includes/header.php` → `app/Views/layouts/header.php`
- Move `includes/footer.php` → `app/Views/layouts/footer.php`
- Update all path references to use CI4 helpers

### 5. Create Controllers
- `Home.php` - for index.php
- `About.php` - for about/index.php
- `Contact.php` - for contact/index.php
- `Impact.php` - for impact/index.php
- `SuccessStories.php` - for success-stories/index.php
- `Initiatives.php` - for entrepreneurship-development, skill-development, education, women-empowerment

### 6. Convert Page Files to Views
- Move content from each PHP file to corresponding view file
- Remove includes, replace with `<?= view('layouts/header') ?>` etc.
- Update all path constants to use CI4 helpers

### 7. Create Public Entry Point
- Create `public/index.php` (CI4 entry point)
- Move assets (img/, assets/, js/, lib/) to `public/` or keep in root with proper .htaccess

### 8. Set Up Routes
- Define all routes in `app/Config/Routes.php`
- Map URLs to controllers

### 9. Update .htaccess
- Configure URL rewriting for clean URLs
- Set document root to `public/` directory

## Path Migration

### Old Constants → CI4 Helpers
- `S_DOMAINPATH` → `base_url()`
- `S_IMGPATH` → `base_url('img/')`
- `S_CSSPATH` → `base_url('assets/css/')`
- `S_JSPATH` → `base_url('js/')`
- `S_INCLUDESPATH` → (no longer needed, use `view()`)

## Testing Checklist
- [ ] Homepage loads correctly
- [ ] All pages load correctly
- [ ] Images load correctly
- [ ] CSS loads correctly
- [ ] JavaScript loads correctly
- [ ] Navigation works
- [ ] Forms work (if any)
- [ ] All links work

## Notes
- Keep existing assets (img/, assets/, js/, lib/) in their current locations
- Update .htaccess to allow access to these directories
- Maintain backward compatibility during migration if possible

