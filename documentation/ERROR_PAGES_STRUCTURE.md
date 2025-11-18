# Error Pages Structure

## Overview

All error pages are now organized in the `app/Views/errors/html/` folder with a clean, structured approach.

## File Structure

```
app/Views/errors/html/
├── 404.php              # Custom 404 error page (user-friendly)
├── 500.php              # Custom 500 error page (user-friendly)
├── othererrors.php      # Generic error page for other error codes
├── error_404.php        # CI4 compatibility wrapper for 404
├── error_500.php        # CI4 compatibility wrapper for 500
├── error_exception.php  # CI4 development mode error display
└── production.php       # CI4 production mode fallback (uses othererrors.php)
```

## How It Works

### 1. Custom Error Views (404.php, 500.php, othererrors.php)
- **Purpose**: User-friendly error pages with site layout
- **Features**:
  - Uses same layout as other pages (head, header, footer)
  - Shows helpful navigation links
  - User-friendly error messages
  - Consistent design with the rest of the site

### 2. CI4 Compatibility Wrappers (error_*.php)
- **Purpose**: Bridge between CI4's automatic error handler and our custom views
- **How it works**:
  - CI4 looks for `error_{statusCode}.php` files
  - These files simply call our custom views
  - Example: `error_404.php` → calls `view('errors/html/404')`

### 3. Generic Error Handler (othererrors.php)
- **Purpose**: Handles any error code that doesn't have a specific view
- **Features**:
  - Dynamically displays the error code
  - Shows appropriate error title and message
  - Provides helpful navigation links
  - Used for: 400, 401, 403, 405, 408, 429, 502, 503, 504, etc.

## Error Controller

The `Error` controller (`app/Controllers/Error.php`) provides:

1. **`index()`** - Display error page via `/error_document?code=XXX`
2. **`show404()`** - Handle 404 errors (called automatically)
3. **`showError($statusCode)`** - Handle any error code

### Usage Examples

```php
// Direct access to error page
http://lhunnatva/error_document          // Shows 404
http://lhunnatva/error_document?code=500 // Shows 500
http://lhunnatva/error_document?code=403 // Shows 403 using othererrors.php
```

## Automatic Error Handling

CI4 automatically handles errors:

1. **404 Errors**: 
   - Routes.php sets `Error::show404()` as 404 override
   - Calls `errors/html/404.php` view

2. **500 Errors**:
   - CI4 looks for `error_500.php`
   - Which calls `errors/html/500.php`

3. **Other Errors**:
   - CI4 looks for `error_{code}.php`
   - If not found, uses `production.php` (in production)
   - Which calls `errors/html/othererrors.php` with the error code

## Benefits

✅ **Clean Structure**: All error pages in one organized folder  
✅ **User-Friendly**: Consistent design with helpful navigation  
✅ **Flexible**: Easy to add new error codes  
✅ **Maintainable**: Single source of truth for error page design  
✅ **CI4 Compatible**: Works with CI4's automatic error handling  

## Adding New Error Codes

To add a specific error page for a new error code (e.g., 403):

1. Create `app/Views/errors/html/403.php` (optional - for custom design)
2. Create `app/Views/errors/html/error_403.php` that calls your custom view
3. Or let it use `othererrors.php` automatically via `production.php`

## Removed Files

- ❌ `app/Views/error/` folder (redundant, removed)
- ❌ `404.html` (replaced by CI4 error handling)

