# .htaccess Troubleshooting Guide

## Current Issue
Even simple PHP files in `public/` are giving 500 errors, suggesting the root `.htaccess` might be interfering.

## Step-by-Step Diagnosis

### Step 1: Test Without .htaccess

1. **Rename root .htaccess:**
   ```
   .htaccess → .htaccess.backup
   ```

2. **Rename public .htaccess:**
   ```
   public/.htaccess → public/.htaccess.backup
   ```

3. **Test:**
   - Visit: `http://lhunnatva/public/simple.php`
   - If it works → The issue is with .htaccess
   - If it still fails → The issue is with Apache/PHP configuration

### Step 2: Test With Minimal .htaccess

1. **Use the minimal version:**
   ```
   Copy: .htaccess.minimal → .htaccess
   ```

2. **Test again:**
   - `http://lhunnatva/public/simple.php`
   - `http://lhunnatva/`

### Step 3: Check Apache Error Log

The error log will show the exact issue:
- Location: `C:\wamp64\logs\apache_error.log`
- Or: WAMP menu → Apache → Error log

Look for:
- `.htaccess: Invalid command` → Syntax error
- `.htaccess: RewriteEngine not allowed here` → mod_rewrite not enabled
- `.htaccess: AllowOverride not allowed` → AllowOverride not set to All

### Step 4: Verify Apache Configuration

In `httpd.conf`, ensure:

```apache
<Directory "G:/job-iwt/unnatva.org">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

### Step 5: Check mod_rewrite

1. WAMP menu → Apache → Apache modules
2. Make sure `rewrite_module` is checked
3. Restart Apache

## Common .htaccess Issues

### Issue 1: Order of Rules
Rules are processed top to bottom. The order matters!

**Correct order:**
1. Allow specific directories first (`/public/`, `/img/`, etc.)
2. Allow existing files
3. Route everything else to index.php

### Issue 2: Conflicting Rules
If both root and public have .htaccess, they both apply. Make sure they don't conflict.

### Issue 3: Apache Version Differences
- Apache 2.2 uses: `Order allow,deny` / `Deny from all`
- Apache 2.4 uses: `Require all denied`

The current .htaccess uses both for compatibility.

## Recommended Solution

**Set Document Root to `public/` folder** (Best for CI4):

1. Open `httpd.conf`
2. Find VirtualHost for `lhunnatva`
3. Set:
   ```apache
   DocumentRoot "G:/job-iwt/unnatva.org/public"
   <Directory "G:/job-iwt/unnatva.org/public">
       Options Indexes FollowSymLinks
       AllowOverride All
       Require all granted
   </Directory>
   ```
4. Restart Apache
5. Then you can remove the root `.htaccess` entirely!

## Quick Test Commands

After each change, test:
- `http://lhunnatva/public/simple.php` → Should show "Hello World"
- `http://lhunnatva/public/phpinfo.php` → Should show PHP info
- `http://lhunnatva/` → Should show CI4 homepage

