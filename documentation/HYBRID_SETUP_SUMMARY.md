# Hybrid Approach Setup Summary

## ✅ What's Been Done

### 1. React Components Created
- ✅ `HomeCarousel.jsx` - Standalone carousel component
- ✅ `ImpactCounters.jsx` - Standalone counters component
- ✅ Entry points created for building

### 2. Build Configuration
- ✅ `vite.components.config.js` - Builds standalone components
- ✅ `package.json` scripts updated:
  - `npm run build:components` - Build components only
  - `npm run build:all` - Build SPA + components

### 3. Documentation
- ✅ Migration plan created
- ✅ Implementation guide created
- ✅ Example CI4 view created (`index-hybrid-example.php`)

## 📋 Next Steps

### Step 1: Build Components
```bash
cd frontend
npm run build:components
```

This creates:
- `public/js/react/components/carousel.js`
- `public/js/react/components/counters.js`

### Step 2: Update CI4 Home Controller
Add carousel and stats data:

```php
// app/Controllers/Home.php
public function index(): string
{
    $data = [
        'title' => 'UNNATVA',
        'bodyClass' => 'act_home',
        'carouselSlides' => [
            [
                'heading' => "Partner with Us to Empower Tomorrow's Changemakers",
                'highlightedWords' => ['Changemakers'],
                'image' => 'banner-slider-1.png'
            ],
            // ... add all 5 slides
        ],
        'impactStats' => [
            [
                'value' => '4519',
                'suffix' => '+',
                'text' => 'Beneficiaries Impacted',
                'bg' => 'counter-bg-1.svg'
            ],
            // ... add all 4 stats
        ]
    ];
    
    return view('home/index', $data);
}
```

### Step 3: Update CI4 Home View
Replace Bootstrap carousel with React mounting point:

**In `app/Views/home/index.php`:**

Replace lines 17-119 (carousel HTML) with:
```php
<!-- React Carousel Component -->
<div id="home-carousel" data-slides='<?= json_encode($carouselSlides ?? [], JSON_HEX_APOS | JSON_HEX_QUOT) ?>'></div>
```

Replace lines 196-250 (impact counters HTML) with:
```php
<!-- React Impact Counters Component -->
<div id="impact-counters" data-stats='<?= json_encode($impactStats ?? [], JSON_HEX_APOS | JSON_HEX_QUOT) ?>'></div>
```

Add at bottom (before `</body>`):
```php
<!-- Load React and ReactDOM -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Load React Bootstrap (if components use it) -->
<script src="https://unpkg.com/react-bootstrap@2/dist/react-bootstrap.min.js"></script>

<!-- Load our React components -->
<script src="<?= js_path('react/components/carousel.js') ?>"></script>
<script src="<?= js_path('react/components/counters.js') ?>"></script>
```

### Step 4: Test
1. Build: `npm run build:components`
2. Visit: `http://lhunnatva/`
3. Verify carousel works
4. Verify counters work
5. Check page source (should have server-rendered HTML)

## 📁 File Structure

```
frontend/
├── src/
│   └── components/
│       └── standalone/
│           ├── HomeCarousel.jsx      ← Component
│           ├── ImpactCounters.jsx    ← Component
│           └── entry-points/
│               ├── carousel.js      ← Build entry
│               └── counters.js      ← Build entry
├── vite.components.config.js        ← Build config
└── package.json                     ← Build scripts

public/js/react/components/          ← Output directory
├── carousel.js                      ← Built component
└── counters.js                      ← Built component

app/Views/home/
├── index.php                        ← Update this
└── index-hybrid-example.php         ← Reference example
```

## 🎯 Benefits

- ✅ **Perfect SEO**: Server-rendered HTML
- ✅ **Interactive**: React components for carousels, counters
- ✅ **Simpler**: No full SPA complexity
- ✅ **Best of Both**: SEO + Modern UX

## ⚠️ Important Notes

1. **React Dependencies**: Components bundle React/ReactDOM (or use CDN)
2. **Data Format**: Pass data as JSON in `data-*` attributes
3. **Server First**: HTML loads first, React enhances
4. **Header/Footer**: Will still reload (traditional navigation)

## 🔄 Migration Strategy

1. **Keep React SPA** for now (in `frontend/`)
2. **Build components** for embedding
3. **Update CI4 views** gradually
4. **Test each page** as you migrate
5. **Keep SPA structure** for future admin

## 📝 Example Usage

See `app/Views/home/index-hybrid-example.php` for complete example.

Ready to proceed? Let me know when you want to:
1. Build the components
2. Update the CI4 home view
3. Test the implementation

