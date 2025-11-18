# View Conversion Guide

## Conversion Pattern

For each page PHP file, make these replacements:

1. **Remove config include:**
   - `<?php include 'includes/config.php'; ?>` → Remove
   - `<?php include '../includes/config.php'; ?>` → Remove

2. **Replace view includes:**
   - `<?php include(S_INCLUDESPATH . "head.php"); ?>` → `<?= view('layouts/head') ?>`
   - `<?php include(S_INCLUDESPATH . "header.php"); ?>` → `<?= view('layouts/header') ?>`
   - `<?php include(S_INCLUDESPATH . "footer.php"); ?>` → `<?= view('layouts/footer') ?>`

3. **Replace path constants:**
   - `<?= S_IMGPATH ?>filename` → `<?= img_path('filename') ?>`
   - `<?= S_DOMAINPATH ?>` → `<?= base_url() ?>`
   - `<?= S_DOMAINPATH ?>path/` → `<?= base_url('path') ?>`
   - `<?= S_CSSPATH ?>` → `<?= css_path() ?>`
   - `<?= S_JSPATH ?>` → `<?= js_path() ?>`

4. **Update title:**
   - `<title>UNNATVA | Page Name</title>` → `<title><?= esc($title ?? 'UNNATVA | Page Name') ?></title>`

5. **Update body class:**
   - `<body class="act_about">` → `<body class="<?= esc($bodyClass ?? 'act_about') ?>">`

## Files to Convert

- ✅ `contact/index.php` → `app/Views/contact/index.php` (DONE)
- ⏳ `index.php` → `app/Views/home/index.php`
- ⏳ `about/index.php` → `app/Views/about/index.php`
- ⏳ `impact/index.php` → `app/Views/impact/index.php`
- ⏳ `success-stories/index.php` → `app/Views/success-stories/index.php`
- ⏳ `entrepreneurship-development/index.php` → `app/Views/initiatives/entrepreneurship.php`
- ⏳ `skill-development/index.php` → `app/Views/initiatives/skill.php`
- ⏳ `education/index.php` → `app/Views/initiatives/education.php`
- ⏳ `women-empowerment/index.php` → `app/Views/initiatives/women.php`
- ⏳ `media/index.php` → `app/Views/media/index.php`
- ⏳ `privacy-policy/index.php` → `app/Views/privacy-policy/index.php`

## Special Notes

- For `S_IMGPATH` in inline styles: `url(<?= S_IMGPATH ?>image.png)` → `url(<?= img_path('image.png') ?>)`
- For links: `href="<?= S_DOMAINPATH ?>about"` → `href="<?= base_url('about') ?>"`
- Keep all JavaScript and inline styles as-is (just update paths)

