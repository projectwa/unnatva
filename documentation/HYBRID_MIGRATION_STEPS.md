# Hybrid Approach Migration Steps

## Current Status
- ✅ React Helmet implemented
- ✅ Standalone components created
- ✅ Build configuration ready
- ⏳ CI4 views need updating
- ⏳ Components need building

## Step-by-Step Migration

### Step 1: Build React Components
```bash
cd frontend
npm run build:components
```

This will create:
- `public/js/react/components/carousel.js`
- `public/js/react/components/counters.js`

### Step 2: Update CI4 Home Controller
Add data for React components:

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

### Step 3: Update CI4 Home View
Replace carousel HTML with React mounting point:

**Before (Current):**
```php
<div id="header-carousel" class="carousel slide" data-bs-ride="carousel">
    <!-- Bootstrap carousel HTML -->
</div>
```

**After (Hybrid):**
```php
<!-- React component mounting point -->
<div id="home-carousel" data-slides='<?= json_encode($carouselSlides, JSON_HEX_APOS | JSON_HEX_QUOT) ?>'></div>

<!-- Load React components at bottom of page -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="<?= js_path('react/components/carousel.js') ?>"></script>
```

### Step 4: Test
1. Build components: `npm run build:components`
2. Visit home page
3. Verify carousel works
4. Check page source (should have server-rendered HTML)
5. Verify SEO meta tags

## Benefits After Migration

- ✅ **Perfect SEO**: All content in server-rendered HTML
- ✅ **Interactive Components**: React carousels, counters work
- ✅ **No Header/Footer Reload**: Still happens (traditional navigation)
- ✅ **Simpler**: No full SPA complexity

## Important Notes

1. **React Dependencies**: Components bundle React/ReactDOM, or use CDN
2. **Data Attributes**: Pass data via `data-*` attributes (JSON)
3. **Server-Rendered First**: HTML loads first, React enhances
4. **SEO Friendly**: Search engines see full HTML

## Next Components to Extract

1. ✅ Carousel
2. ✅ Impact Counters
3. ⏳ Client Logos Carousel
4. ⏳ What's Happening Carousel
5. ⏳ Forms (contact, contribution)

## Future: Admin SPA

Keep `frontend/` structure for future admin SPA:
- Full React SPA for admin dashboard
- No SEO concerns
- Better UX for complex admin tasks

