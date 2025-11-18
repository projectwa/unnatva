# Hybrid Approach Implementation Guide

## Overview
Implementing Hybrid Approach:
- **Public Pages**: CI4 Views (server-rendered) + Embedded React Components
- **Admin/CMS**: Full React SPA (future)

## Architecture

### Current Structure
```
app/Views/                    ← CI4 Views (already exist)
├── home/index.php
├── about/index.php
└── ...

frontend/                     ← React SPA (current)
└── src/
    └── pages/
        └── HomePage.jsx     ← Will be converted to components
```

### Target Structure
```
app/Views/                    ← CI4 Views (server-rendered HTML)
├── home/index.php           ← Includes React component mounting points
├── about/index.php
└── ...

public/js/react/components/   ← Standalone React components
├── carousel.js              ← Built component bundle
├── counters.js
└── ...

frontend/                     ← Keep for future admin SPA
└── src/
    └── components/
        └── standalone/      ← Components that can be embedded
```

## Implementation Steps

### Step 1: Create Standalone Components ✅
- ✅ Created `HomeCarousel.jsx`
- ✅ Created `ImpactCounters.jsx`
- ✅ Created entry points

### Step 2: Build Configuration
- ✅ Created `vite.components.config.js`
- ✅ Added build scripts to `package.json`

### Step 3: Update CI4 Views
- ⏳ Add React component mounting points
- ⏳ Include component scripts
- ⏳ Pass data via data attributes

### Step 4: Build Components
- ⏳ Run `npm run build:components`
- ⏳ Components output to `public/js/react/components/`

### Step 5: Test
- ⏳ Test components in CI4 views
- ⏳ Verify SEO (server-rendered HTML)
- ⏳ Verify interactivity works

## Usage in CI4 Views

### Example: Home Page with Carousel

**CI4 View (`app/Views/home/index.php`):**
```php
<?= view('layouts/header') ?>

<!-- Carousel mounting point -->
<div id="home-carousel" data-slides='<?= json_encode($carouselSlides) ?>'></div>

<!-- Rest of page content (server-rendered) -->
<div class="container-xxl py-6" id="about">
    <!-- Static HTML content -->
</div>

<!-- Impact Counters mounting point -->
<div id="impact-counters" data-stats='<?= json_encode($impactStats) ?>'></div>

<?= view('layouts/footer') ?>

<!-- Load React components -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="<?= js_path('react/components/carousel.js') ?>"></script>
<script src="<?= js_path('react/components/counters.js') ?>"></script>
```

**Controller (`app/Controllers/Home.php`):**
```php
public function index() {
    $data = [
        'title' => 'Home',
        'carouselSlides' => [
            [
                'heading' => "Partner with Us to Empower Tomorrow's Changemakers",
                'highlightedWords' => ['Changemakers'],
                'image' => 'banner-slider-1.png'
            ],
            // ... more slides
        ],
        'impactStats' => [
            [
                'value' => '4519',
                'suffix' => '+',
                'text' => 'Beneficiaries Impacted',
                'bg' => 'counter-bg-1.svg'
            ],
            // ... more stats
        ]
    ];
    
    return view('home/index', $data);
}
```

## Benefits

- ✅ **Perfect SEO**: Server-rendered HTML
- ✅ **Interactive Components**: React for carousels, counters, etc.
- ✅ **Simpler**: No full SPA complexity
- ✅ **Best of Both**: SEO + Modern UX

## Next Steps

1. Build components: `npm run build:components`
2. Update CI4 views with mounting points
3. Update controllers to pass data
4. Test and verify

