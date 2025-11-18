# CodeIgniter 4 Setup Guide

## ✅ Completed Setup

### 1. Entry Point Created
- ✅ `public/index.php` - CI4 front controller
- ✅ `public/.htaccess` - URL rewriting rules
- ✅ Root `.htaccess` - Routes requests to public/ while allowing asset access

### 2. Configuration
- ✅ `app/Config/App.php` - Auto-detects baseURL based on server name
- ✅ `app/Config/Paths.php` - Defines system, app, writable paths
- ✅ `app/Config/Routes.php` - All routes defined
- ✅ `app/Config/Autoload.php` - Helper autoloading configured

### 3. Helpers
- ✅ `app/Helpers/site_helper.php` - Custom path helpers (img_path, css_path, js_path, lib_path)

### 4. Controllers
- ✅ All controllers created and configured

### 5. Views
- ✅ All page views converted to CI4 format
- ✅ Layout views (head, header, footer) created

## 📋 Next Steps

### 1. Install CI4 Framework
```bash
composer require codeigniter4/framework
```

This will install the framework in `vendor/codeigniter4/framework/`

### 2. Configure Web Server

#### Option A: Set Document Root to `public/` (Recommended)
- Point your web server's document root to the `public/` directory
- This is the most secure approach
- Assets (img/, assets/, js/, lib/) will need to be moved to `public/` or accessed via symlinks

#### Option B: Keep Current Structure (Current Setup)
- Document root remains at project root
- Root `.htaccess` routes requests to `public/index.php`
- Assets remain accessible directly from root
- This is the current configuration

### 3. Environment Configuration

The `.env` file should be configured (if needed). The App.php config auto-detects:
- `unnatva.org` → `https://unnatva.org/`
- `localhost` → `http://localhost/` (or `/UNNATVA/site/` if in subdirectory)
- `lhunnatva` → `http://lhunnatva/`

You can override this in `.env`:
```
app.baseURL = 'http://your-domain.com/'
```

### 4. Test the Application

1. Ensure CI4 framework is installed: `composer install`
2. Make sure `writable/` directory is writable
3. Access the site through your web server
4. Test all pages to ensure they load correctly

## 🔧 File Structure

```
project-root/
├── app/
│   ├── Config/          # CI4 configuration
│   ├── Controllers/     # All page controllers
│   ├── Helpers/         # Custom helpers (site_helper.php)
│   └── Views/           # All view files
├── public/
│   ├── index.php        # CI4 entry point ✅
│   ├── .htaccess        # URL rewriting ✅
│   └── robots.txt       # Robots file ✅
├── assets/              # CSS, SCSS (stays in root)
├── img/                 # Images (stays in root)
├── js/                  # JavaScript (stays in root)
├── lib/                 # Third-party libraries (stays in root)
├── vendor/              # Composer dependencies (CI4 framework)
├── writable/            # CI4 writable directory
└── .htaccess            # Root routing to public/ ✅
```

## ⚠️ Important Notes

1. **Asset Paths**: Assets (img/, assets/, js/, lib/) are currently in the root directory. They will be accessible via the root `.htaccess` configuration.

2. **Base URL**: The `App.php` config auto-detects the baseURL. If you need to override it, set it in `.env`:
   ```
   app.baseURL = 'http://your-domain.com/'
   ```

3. **Helper Functions**: The `site` helper is loaded automatically in `BaseController`. All views use:
   - `base_url()` - CI4's built-in helper
   - `img_path('filename')` - Custom helper
   - `css_path('filename')` - Custom helper
   - `js_path('filename')` - Custom helper
   - `lib_path('filename')` - Custom helper

4. **Old Files**: The original PHP files (index.php, about/index.php, etc.) are still in the root. These can be kept as backup or removed after testing.

## 🧪 Testing Checklist

- [ ] Install CI4 framework via Composer
- [ ] Test homepage loads
- [ ] Test all pages load correctly
- [ ] Verify images load
- [ ] Verify CSS loads
- [ ] Verify JavaScript loads
- [ ] Test navigation links
- [ ] Test carousels work
- [ ] Test forms (if any)
- [ ] Verify all assets load correctly

