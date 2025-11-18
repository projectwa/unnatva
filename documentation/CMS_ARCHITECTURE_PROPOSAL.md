# CMS Architecture Proposal for UNNATVA Foundation

## Overview
This document outlines the proposed architecture for building a React-based Content Management System (CMS) that integrates seamlessly with the existing CI4 + React hybrid setup.

## Recommended Architecture: **Unified CI4 Backend + Separate Admin React App**

### Why This Approach?
✅ **Single CI4 Backend**: One CodeIgniter 4 installation serves both public site and CMS API  
✅ **Separation of Concerns**: Public React SPA and Admin React SPA are separate but share backend  
✅ **Security**: Admin routes are isolated and protected  
✅ **Maintainability**: Clear separation between public and admin code  
✅ **Scalability**: Easy to add features to either side independently  

---

## Folder Structure

```
unnatva.org/
├── app/                          # CI4 Backend (shared)
│   ├── Controllers/
│   │   ├── Api/                 # Public API (existing)
│   │   │   └── Pages.php
│   │   └── Admin/               # NEW: Admin API
│   │       ├── Auth.php         # Authentication
│   │       ├── Dashboard.php   # Dashboard stats
│   │       ├── Pages.php        # Page CRUD
│   │       ├── Media.php        # Media management
│   │       ├── Menu.php         # Navigation management
│   │       ├── Settings.php     # Site settings
│   │       └── Users.php        # User management
│   ├── Models/
│   │   ├── PageModel.php        # NEW
│   │   ├── MediaModel.php       # NEW
│   │   ├── MenuModel.php        # NEW
│   │   ├── UserModel.php        # NEW
│   │   └── SettingModel.php     # NEW
│   ├── Config/
│   │   ├── Routes.php           # Add admin routes
│   │   └── Filters.php          # Add admin auth filter
│   └── Database/
│       └── Migrations/           # NEW: Database migrations
│
├── frontend/                     # Public React SPA (existing)
│   └── src/
│       ├── app/
│       ├── pages/
│       └── components/
│
├── cms7x9k2m4p8q1w5/            # NEW: Admin React SPA (random name for security)
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   ├── Router.jsx
│   │   │   └── providers.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Pages/
│   │   │   │   ├── List.jsx
│   │   │   │   ├── Edit.jsx
│   │   │   │   └── Create.jsx
│   │   │   ├── Media/
│   │   │   │   └── Library.jsx
│   │   │   ├── Menu/
│   │   │   │   └── Manager.jsx
│   │   │   └── Settings/
│   │   │       └── General.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── TopBar.jsx
│   │   │   ├── forms/
│   │   │   │   ├── RichTextEditor.jsx
│   │   │   │   ├── ImageUploader.jsx
│   │   │   │   └── MediaPicker.jsx
│   │   │   └── common/
│   │   │       ├── DataTable.jsx
│   │   │       └── Modal.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── storage.js
│   │   └── hooks/
│   │       ├── useAuth.js
│   │       └── useApi.js
│   ├── package.json
│   └── vite.config.js
│
├── public/
│   ├── index.php                 # CI4 entry point
│   ├── cms7x9k2m4p8q1w5/         # NEW: Admin entry point (random name)
│   │   └── index.php             # Serves admin React app
│   └── js/
│       ├── react/
│       │   └── app.js            # Public SPA bundle
│       └── cms7x9k2m4p8q1w5/
│           └── app.js            # NEW: Admin SPA bundle
```

---

## CMS Features

### 1. **Authentication & Authorization**
- Login/Logout
- JWT or Session-based authentication
- Role-based access control (Admin, Editor, Author)
- Password reset functionality

### 2. **Dashboard**
- Site statistics (visits, pages, media count)
- Recent activity log
- Quick actions
- System health status

### 3. **Page Management**
- Create, Read, Update, Delete pages
- Rich text editor (TinyMCE or CKEditor)
- Page templates
- SEO fields (meta title, description, keywords)
- Draft/Published status
- Scheduled publishing
- Page hierarchy (parent/child pages)

### 4. **Media Management**
- Upload images, documents, videos
- Media library with thumbnails
- Image cropping/resizing
- File organization (folders/tags)
- Search and filter
- Bulk operations

### 5. **Menu/Navigation Management**
- Drag-and-drop menu builder
- Multiple menu locations (header, footer)
- Menu item types (page, link, category)
- Nested menu items

### 6. **Content Blocks/Components**
- Reusable content blocks
- Carousel management
- Counter/statistics management
- Testimonial management
- Success stories management

### 7. **Settings Management**
- General settings (site name, email, etc.)
- SEO settings
- Social media links
- Contact information
- Theme settings

### 8. **User Management** (Optional - for multi-user)
- User CRUD
- Role assignment
- Activity logs

---

## Technical Implementation

### CI4 Backend Structure

#### Routes (`app/Config/Routes.php`)
```php
// Public routes (existing)
$routes->get('/', 'Spa::index');
// ... existing routes ...

// Admin routes (NEW) - Using random folder name for security
$routes->group('cms7x9k2m4p8q1w5', ['namespace' => 'App\Controllers\Admin', 'filter' => 'auth'], function($routes) {
    // Admin SPA entry point
    $routes->get('/', 'Admin::index');
    
    // Admin API routes
    $routes->group('api', function($routes) {
        // Auth
        $routes->post('auth/login', 'Auth::login');
        $routes->post('auth/logout', 'Auth::logout');
        $routes->get('auth/me', 'Auth::me');
        
        // Dashboard
        $routes->get('dashboard/stats', 'Dashboard::stats');
        
        // Pages
        $routes->resource('pages', ['controller' => 'Pages']);
        
        // Media
        $routes->post('media/upload', 'Media::upload');
        $routes->get('media', 'Media::index');
        $routes->delete('media/(:num)', 'Media::delete/$1');
        
        // Menu
        $routes->get('menu', 'Menu::index');
        $routes->post('menu', 'Menu::save');
        
        // Settings
        $routes->get('settings', 'Settings::index');
        $routes->post('settings', 'Settings::update');
    });
});

// Public admin login (no auth required) - Using random folder name
$routes->get('cms7x9k2m4p8q1w5/login', 'App\Controllers\Admin\Admin::login');
```

#### Admin Controller Example (`app/Controllers/Admin/Pages.php`)
```php
<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\PageModel;
use CodeIgniter\API\ResponseTrait;

class Pages extends BaseController
{
    use ResponseTrait;

    protected $pageModel;

    public function __construct()
    {
        $this->pageModel = new PageModel();
    }

    public function index()
    {
        $pages = $this->pageModel->findAll();
        return $this->respond($pages);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $id = $this->pageModel->insert($data);
        return $this->respondCreated(['id' => $id]);
    }

    public function update($id)
    {
        $data = $this->request->getJSON(true);
        $this->pageModel->update($id, $data);
        return $this->respondUpdated(['id' => $id]);
    }

    public function delete($id)
    {
        $this->pageModel->delete($id);
        return $this->respondDeleted(['id' => $id]);
    }
}
```

### React Admin App Structure

#### Admin Router (`admin/src/app/Router.jsx`)
```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminLayout from '../components/layout/AdminLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PagesList from '../pages/Pages/List';
import PageEdit from '../pages/Pages/Edit';
import MediaLibrary from '../pages/Media/Library';
import MenuManager from '../pages/Menu/Manager';
import Settings from '../pages/Settings/General';

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pages" element={<PagesList />} />
        <Route path="pages/create" element={<PageEdit />} />
        <Route path="pages/edit/:id" element={<PageEdit />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="menu" element={<MenuManager />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```

#### Admin Entry Point (`public/cms7x9k2m4p8q1w5/index.php`)
```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Admin - UNNATVA Foundation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
    <div id="root"></div>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="<?= base_url('js/cms7x9k2m4p8q1w5/app.js') ?>"></script>
</body>
</html>
```

---

## Database Schema

### Pages Table
```sql
CREATE TABLE pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords VARCHAR(255),
    status ENUM('draft', 'published') DEFAULT 'draft',
    parent_id INT NULL,
    template VARCHAR(100),
    created_at DATETIME,
    updated_at DATETIME,
    created_by INT,
    updated_by INT
);
```

### Media Table
```sql
CREATE TABLE media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    file_size INT,
    mime_type VARCHAR(100),
    alt_text VARCHAR(255),
    description TEXT,
    created_at DATETIME,
    created_by INT
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    menu_location VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    page_id INT NULL,
    parent_id INT NULL,
    order_index INT DEFAULT 0,
    target VARCHAR(10) DEFAULT '_self',
    created_at DATETIME
);
```

---

## Build Configuration

### Admin Vite Config (`cms7x9k2m4p8q1w5/vite.config.js`)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../public/js/cms7x9k2m4p8q1w5',
    rollupOptions: {
      output: {
        entryFileNames: 'app.js',
        format: 'iife',
        name: 'AdminApp'
      }
    }
  }
});
```

### Package.json Scripts
```json
{
  "scripts": {
    "build:admin": "cd cms7x9k2m4p8q1w5 && npm run build",
    "build:public": "cd frontend && npm run build",
    "build:all": "npm run build:public && npm run build:admin"
  }
}
```

---

## Security Considerations

### Security Through Obscurity (First Layer)
- ✅ **Random Admin Folder Name**: Using `cms7x9k2m4p8q1w5` instead of `admin` to make it harder for attackers to find the admin panel
- ⚠️ **Note**: This is NOT a security measure by itself - it only makes discovery harder

### Real Security Measures (To Implement)

1. **Authentication & Authorization**
   - Strong password requirements
   - JWT tokens with expiration
   - Session management
   - Role-based access control (RBAC)
   - Two-factor authentication (2FA) - optional but recommended

2. **Input Validation & Sanitization**
   - Validate all inputs on both frontend and backend
   - Sanitize rich text content (HTML purifier)
   - File upload validation (type, size, content scanning)
   - SQL injection prevention (CI4 Query Builder already protects this)

3. **CSRF Protection**
   - Use CI4's built-in CSRF protection
   - CSRF tokens for all state-changing operations

4. **Rate Limiting**
   - Implement rate limiting on login endpoints
   - Prevent brute force attacks
   - Limit API requests per IP/user

5. **XSS Protection**
   - Escape all outputs
   - Content Security Policy (CSP) headers
   - Sanitize user-generated content

6. **Security Headers**
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security (HSTS)
   - Referrer-Policy

7. **File Upload Security**
   - Validate file types (whitelist approach)
   - Scan for malware
   - Store uploads outside web root when possible
   - Rename uploaded files to prevent execution

8. **Logging & Monitoring**
   - Log all admin actions
   - Monitor failed login attempts
   - Alert on suspicious activity

9. **Database Security**
   - Use prepared statements (CI4 does this)
   - Limit database user permissions
   - Regular backups
   - Encrypt sensitive data

10. **Environment Security**
    - Keep `.env` file secure (never commit to git)
    - Use strong encryption keys
    - Regular security updates

---

## Benefits of This Architecture

✅ **Single Backend**: One CI4 installation serves both public and admin  
✅ **Code Reusability**: Share models, helpers, and utilities  
✅ **Consistent API**: Same patterns for public and admin APIs  
✅ **Easy Deployment**: Single deployment process  
✅ **Cost Effective**: No need for separate backend infrastructure  
✅ **Maintainable**: Clear separation but unified codebase  

---

## Next Steps

### Phase 1: Setup & Structure
1. Create admin folder with random name: `cms7x9k2m4p8q1w5/`
2. Setup React app structure
3. Configure build system (Vite)
4. Create database migrations

### Phase 2: Authentication
1. Implement login/logout
2. JWT token management
3. Protected routes
4. Session handling

### Phase 3: Dashboard
1. Build dashboard UI
2. Display basic statistics
3. Recent activity log

### Phase 4: Page Management
1. Page CRUD operations
2. Rich text editor integration
3. SEO fields
4. Draft/Published workflow

### Phase 5: Media Management
1. File upload functionality
2. Media library
3. Image processing

### Phase 6: Menu Management
1. Drag-and-drop menu builder
2. Menu item management

### Phase 7: Settings
1. General settings
2. SEO settings
3. Social media links

### Phase 8: Security Hardening
1. Implement all security measures listed above
2. Security audit
3. Penetration testing
4. Performance optimization

### Phase 9: Polish & Advanced Features
1. UI/UX improvements
2. Advanced features
3. Documentation

---

## Recommended Libraries

- **Rich Text Editor**: TinyMCE or CKEditor
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios (or native fetch)
- **State Management**: React Context API (or Zustand for complex state)
- **UI Components**: React Bootstrap (already in use)
- **Icons**: Bootstrap Icons (already in use)
- **Date Handling**: date-fns
- **Image Upload**: react-dropzone

---

Would you like me to start implementing this architecture? I can begin with:
1. Setting up the admin folder structure
2. Creating the database migrations
3. Building the authentication system
4. Creating the admin React app skeleton

