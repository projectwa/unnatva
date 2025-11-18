# Apache Configuration Fix for 500 Internal Server Error

## The Problem
Even simple PHP files are giving 500 errors, which indicates an Apache/PHP configuration issue, not a CodeIgniter issue.

## Solution 1: Temporarily Disable .htaccess (Test)

1. **Rename root .htaccess:**
   ```
   Rename: .htaccess → .htaccess.bak
   ```

2. **Rename public .htaccess:**
   ```
   Rename: public/.htaccess → public/.htaccess.bak
   ```

3. **Test:**
   - Visit: `http://lhunnatva/public/simple.php`
   - If it works, the issue is with .htaccess syntax
   - If it still fails, the issue is with Apache/PHP configuration

## Solution 2: Check Apache Configuration

### Step 1: Verify Document Root

1. Open WAMP menu → Apache → httpd.conf
2. Search for `DocumentRoot`
3. It should be set to your project root: `G:/job-iwt/unnatva.org`
4. Or better yet, set it to: `G:/job-iwt/unnatva.org/public`

### Step 2: Enable mod_rewrite

1. WAMP menu → Apache → Apache modules
2. Make sure `rewrite_module` is checked/enabled
3. Restart Apache

### Step 3: Set AllowOverride

In `httpd.conf`, find the `<Directory>` section for your project and ensure:

```apache
<Directory "G:/job-iwt/unnatva.org">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

### Step 4: Check PHP Handler

Make sure PHP is properly configured:
1. WAMP menu → PHP → PHP version
2. Select PHP 8.4.0 (or 8.0+)
3. Restart Apache

## Solution 3: Check Apache Error Log

1. **Find the error log:**
   - WAMP menu → Apache → Error log
   - Or: `C:\wamp64\logs\apache_error.log`

2. **Look for specific errors:**
   - `.htaccess` syntax errors
   - `mod_rewrite` not found
   - `AllowOverride` issues
   - PHP handler errors

## Solution 4: Recommended Setup (Set Document Root to public/)

**This is the BEST solution for CodeIgniter 4:**

1. Open `httpd.conf`
2. Find your VirtualHost for `lhunnatva` or the main DocumentRoot
3. Change to:
   ```apache
   DocumentRoot "G:/job-iwt/unnatva.org/public"
   <Directory "G:/job-iwt/unnatva.org/public">
       Options Indexes FollowSymLinks
       AllowOverride All
       Require all granted
   </Directory>
   ```
4. Restart Apache
5. Access: `http://lhunnatva/` (without `/public/`)

## Quick Test Commands

After making changes, test:
- `http://lhunnatva/public/simple.php` - Should show "Hello World"
- `http://lhunnatva/public/phpinfo.php` - Should show PHP info
- `http://lhunnatva/` - Should show CodeIgniter homepage

## Common Error Messages in Logs

- **"Invalid command 'RewriteEngine'"** → mod_rewrite not enabled
- **".htaccess: AllowOverride not allowed here"** → AllowOverride not set to All
- **"File does not exist"** → Document root path incorrect
- **"Premature end of script headers"** → PHP syntax error or PHP not processing

