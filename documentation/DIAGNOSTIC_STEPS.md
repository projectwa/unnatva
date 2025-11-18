# Diagnostic Steps for 500 Internal Server Error

## Issue
Even simple PHP files in `public/` are giving 500 errors, which suggests an Apache/PHP configuration issue.

## Step 1: Check Apache Document Root

The most likely issue is that Apache's document root is set to the project root (`G:\job-iwt\unnatva.org\`) instead of the `public/` folder.

### Solution A: Set Document Root to `public/` (Recommended)

1. Open WAMP menu → Apache → httpd.conf
2. Find the VirtualHost for `lhunnatva` or the main DocumentRoot
3. Change it to:
   ```apache
   DocumentRoot "G:/job-iwt/unnatva.org/public"
   <Directory "G:/job-iwt/unnatva.org/public">
       Options Indexes FollowSymLinks
       AllowOverride All
       Require all granted
   </Directory>
   ```
4. Restart Apache

### Solution B: Keep Current Setup (Fix .htaccess)

If you want to keep document root as project root, we need to fix the .htaccess.

## Step 2: Test Simple PHP File

Try accessing: `http://lhunnatva/public/simple.php`

If this works, the issue is with the root .htaccess routing.

## Step 3: Check Apache Error Log

1. WAMP menu → Apache → Error log
2. Look for specific error messages
3. Common location: `C:\wamp64\logs\apache_error.log`

## Step 4: Check if mod_rewrite is Enabled

1. WAMP menu → Apache → Apache modules
2. Make sure `rewrite_module` is checked/enabled

## Step 5: Check AllowOverride Setting

In `httpd.conf`, make sure:
```apache
<Directory "G:/job-iwt/unnatva.org">
    AllowOverride All
</Directory>
```

## Step 6: Temporarily Disable Root .htaccess

1. Rename `.htaccess` to `.htaccess.bak`
2. Try accessing `http://lhunnatva/public/simple.php`
3. If it works, the issue is with the .htaccess file

## Quick Fix: Access Files Directly

If document root is set to project root, try:
- `http://lhunnatva/public/simple.php`
- `http://lhunnatva/public/info.php`
- `http://lhunnatva/public/test.php`

If these work, we need to adjust the .htaccess routing rules.

