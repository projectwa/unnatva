# Troubleshooting Internal Server Error (500)

## Common Causes and Solutions

### 1. Check Apache Error Logs

The error log location depends on your WAMP setup. Common locations:
- `C:\wamp64\logs\apache_error.log`
- `C:\wamp\logs\apache_error.log`
- Check WAMP menu → Apache → Error log

### 2. Check PHP Error Logs

- `C:\wamp64\logs\php_error.log`
- Or check `php.ini` for `error_log` setting

### 3. Verify Document Root

**Option A: Set Document Root to `public/` (Recommended)**
1. Open WAMP menu → Apache → httpd.conf
2. Find `DocumentRoot` and change to:
   ```
   DocumentRoot "G:/job-iwt/unnatva.org/public"
   <Directory "G:/job-iwt/unnatva.org/public">
   ```
3. Restart Apache

**Option B: Keep Current Setup (Root .htaccess)**
- Make sure `mod_rewrite` is enabled in Apache
- Check that `.htaccess` files are being read

### 4. Enable Error Display (Temporary)

Add to `public/index.php` at the top (for debugging only):
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

### 5. Test PHP Directly

Visit: `http://lhunnatva/test.php`
This will show if PHP is working and paths are correct.

### 6. Check File Permissions

Make sure:
- `writable/` directory is writable
- All PHP files are readable

### 7. Verify Composer Dependencies

Run in project root:
```bash
composer install
```

### 8. Check .htaccess Syntax

The root `.htaccess` might have syntax issues. Try temporarily renaming it to see if that's the issue.

### 9. Common Issues

- **Missing vendor folder**: Run `composer install`
- **Incorrect paths**: Check `app/Config/Paths.php`
- **PHP version**: CI4 requires PHP 7.4+ (you have 8.4.0, which is fine)
- **mod_rewrite not enabled**: Enable in Apache modules

## Quick Diagnostic Steps

1. Visit `http://lhunnatva/test.php` - Should show path information
2. Check Apache error log for specific PHP errors
3. Enable error display temporarily to see the actual error
4. Verify `public/index.php` is accessible directly

