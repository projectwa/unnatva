# Database Setup Guide

This guide explains how to set up the database for the UNNATVA CMS.

## Database Tables

The following tables will be created:

1. **users** - Admin users for CMS authentication
2. **pages** - Page content management
3. **carousel_slides** - Home page carousel slides
4. **impact_stats** - Home page impact statistics/counters
5. **content_blocks** - Reusable content blocks (e.g., "What's Happening" items)
6. **media_items** - Media library for images, videos, documents
7. **success_stories** - Success stories with categories
8. **settings** - Site-wide settings

## Prerequisites

1. **Database Configuration**: Update `app/Config/Database.php` with your database credentials:
   ```php
   public array $default = [
       'hostname' => 'localhost',
       'username' => 'your_username',
       'password' => 'your_password',
       'database' => 'unnatva_db',
       // ... other settings
   ];
   ```

2. **Create Database**: Create the database manually:
   ```sql
   CREATE DATABASE unnatva_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

## Running Migrations

### Option 1: Using Spark CLI (Recommended)

```bash
# Run all migrations
php spark migrate

# Run migrations with confirmation
php spark migrate -all

# Rollback last migration
php spark migrate:rollback

# Rollback all migrations
php spark migrate:rollback -all
```

### Option 2: Using CodeIgniter Migration Class

You can also run migrations programmatically, but Spark CLI is recommended.

## Seeding Initial Data

After running migrations, seed the database with initial content:

```bash
php spark db:seed InitialContentSeeder
```

Or if you have a custom seeder command:

```bash
php spark seed:run InitialContentSeeder
```

### What Gets Seeded?

The seeder will populate:

1. **Default Admin User**
   - Username: `admin`
   - Password: `admin123` (⚠️ **CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN**)
   - Email: `admin@unnatva.org`

2. **Pages** (11 pages)
   - home, about, contact, impact, success-stories, media, privacy-policy
   - entrepreneurship-development, skill-development, education, women-empowerment

3. **Carousel Slides** (5 slides)
   - All current home page carousel slides

4. **Impact Stats** (4 stats)
   - Beneficiaries Impacted: 4519+
   - Total Income Generated: 67.78 Cr.
   - Women Trained: 1653
   - Employment Success: 84%

5. **Content Blocks** (3 "What's Happening" items)
   - Sample content blocks from home page

6. **Success Stories** (2 sample stories)
   - Swapnil Lande (Entrepreneurship Development)
   - Yogita Jagdhane (Entrepreneurship Development)
   - *Note: More stories can be added via CMS*

7. **Settings** (9 default settings)
   - Site name, tagline, contact info, social media links

## Migration Files

All migration files are located in `app/Database/Migrations/`:

- `2025-01-11-100000_CreateUsersTable.php`
- `2025-01-11-100001_CreatePagesTable.php`
- `2025-01-11-100002_CreateCarouselSlidesTable.php`
- `2025-01-11-100003_CreateImpactStatsTable.php`
- `2025-01-11-100004_CreateContentBlocksTable.php`
- `2025-01-11-100005_CreateMediaItemsTable.php`
- `2025-01-11-100006_CreateSuccessStoriesTable.php`
- `2025-01-11-100007_CreateSettingsTable.php`

## Seeder File

The seeder file is located at:
- `app/Database/Seeds/InitialContentSeeder.php`

## Verification

After running migrations and seeders, verify the setup:

```sql
-- Check tables
SHOW TABLES;

-- Check admin user
SELECT id, username, email, role FROM users;

-- Check pages
SELECT id, slug, title, is_published FROM pages;

-- Check carousel slides
SELECT id, heading, is_active, sort_order FROM carousel_slides ORDER BY sort_order;

-- Check impact stats
SELECT id, value, suffix, text FROM impact_stats ORDER BY sort_order;
```

## Next Steps

1. **Change Admin Password**: Log in to the CMS and change the default password immediately.

2. **Update Controllers**: Update controllers to fetch data from database instead of hardcoded arrays:
   - `app/Controllers/Home.php` - Fetch carousel and stats from DB
   - `app/Controllers/Api/Pages.php` - Fetch page content from DB

3. **Create Models**: Create CI4 Models for each table to simplify database operations.

4. **Build CMS Admin Panel**: Start building the React admin panel to manage content.

## Troubleshooting

### Migration Fails

If migrations fail, check:
- Database connection settings in `app/Config/Database.php`
- Database user has CREATE TABLE permissions
- Database exists and is accessible

### Seeder Fails

If seeder fails:
- Ensure migrations ran successfully first
- Check for duplicate entries (e.g., if running seeder twice)
- Check database constraints and foreign keys

### Character Encoding Issues

All tables use `utf8mb4` charset. If you see encoding issues:
- Ensure database is created with `utf8mb4` charset
- Check connection charset in Database config
- Verify PHP files are saved as UTF-8

## Database Schema Overview

```
users
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password
├── full_name
├── role (admin|editor)
└── is_active

pages
├── id (PK)
├── slug (UNIQUE)
├── title
├── meta_title
├── meta_description
├── content (LONGTEXT)
└── is_published

carousel_slides
├── id (PK)
├── heading
├── highlighted_words (JSON)
├── image
└── sort_order

impact_stats
├── id (PK)
├── value
├── suffix
├── text
└── sort_order

content_blocks
├── id (PK)
├── block_type
├── title
├── content
├── image
├── video_url
└── sort_order

media_items
├── id (PK)
├── filename
├── file_path
├── file_type
├── category
└── uploaded_by (FK → users.id)

success_stories
├── id (PK)
├── slug (UNIQUE)
├── category
├── name
├── quote
├── story
├── image
└── is_published

settings
├── id (PK)
├── key (UNIQUE)
├── value
├── type
└── group
```



