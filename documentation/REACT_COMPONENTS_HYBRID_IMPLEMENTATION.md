# React Components in Hybrid Approach - Implementation Guide

## Overview

In the hybrid approach, React components are built as **standalone, self-contained bundles** that can be embedded directly into CI4 views. This allows us to:
- Keep server-rendered HTML for SEO
- Add interactive React components where needed
- Avoid full page reloads for component interactions
- Maintain a clean separation between server and client code

---

## 📁 Component Structure

### Source Files Location

```
frontend/
└── src/
    └── components/
        └── standalone/
            ├── HomeCarousel.jsx          # Carousel component
            ├── ImpactCounters.jsx        # Counters component
            └── entry-points/
                ├── carousel.js          # Carousel entry point
                └── counters.js          # Counters entry point
```

### Built Files Location

```
public/
└── js/
    └── react/
        └── components/
            ├── carousel.js              # Built carousel bundle
            └── counters.js               # Built counters bundle
```

---

## 🔄 How It Works

### 1. **Component Definition** (`HomeCarousel.jsx`, `ImpactCounters.jsx`)

These are standard React components that:
- Accept props (data) from the server
- Use React Bootstrap for UI components
- Handle their own initialization (WOW.js, counter animations, etc.)

**Example: `HomeCarousel.jsx`**
```jsx
function HomeCarousel({ slides = [] }) {
  // Component logic here
  return (
    <div className="container-fluid p-0">
      <Carousel>
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            {/* Slide content */}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
```

### 2. **Entry Points** (`entry-points/carousel.js`, `entry-points/counters.js`)

These are the bridge between CI4 views and React components. They:
- Find the mount point in the DOM (by ID)
- Read data from `data-*` attributes
- Parse JSON data
- Mount the React component

**Example: `entry-points/carousel.js`**
```javascript
const mountCarousel = () => {
  const element = document.getElementById('home-carousel');
  if (element && !element.hasAttribute('data-mounted')) {
    const slidesData = element.getAttribute('data-slides');
    if (slidesData) {
      const slides = JSON.parse(slidesData);
      const root = ReactDOM.createRoot(element);
      root.render(React.createElement(HomeCarousel, { slides }));
      element.setAttribute('data-mounted', 'true');
    }
  }
};
```

### 3. **Build Configuration** (`vite.carousel.config.js`, `vite.counters.config.js`)

Each component has its own Vite config that:
- Builds as an IIFE (Immediately Invoked Function Expression)
- Externalizes React/ReactDOM (loaded from CDN)
- Bundles React Bootstrap and other dependencies
- Outputs to `public/js/react/components/`

**Key settings:**
```javascript
{
  build: {
    lib: {
      entry: 'src/components/standalone/entry-points/carousel.js',
      formats: ['iife'],  // Standalone bundle format
    },
    rollupOptions: {
      external: ['react', 'react-dom'],  // Use CDN versions
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
}
```

### 4. **CI4 Controller** (`app/Controllers/Home.php`)

The controller prepares data and passes it to the view:

```php
public function index(): string
{
    $carouselSlides = [
        [
            'heading' => "Partner with Us to Empower Tomorrow's Changemakers",
            'highlightedWords' => ['Changemakers'],
            'image' => 'banner-slider-1.png'
        ],
        // ... more slides
    ];

    $impactStats = [
        [
            'value' => '4519',
            'suffix' => '+',
            'text' => 'Beneficiaries Impacted',
            'bg' => 'counter-bg-1.svg'
        ],
        // ... more stats
    ];

    $data = [
        'carouselSlides' => $carouselSlides,
        'impactStats' => $impactStats
    ];
    
    return view('home/index', $data);
}
```

### 5. **CI4 View** (`app/Views/home/index.php`)

The view:
- Creates mount points with `data-*` attributes containing JSON data
- Loads React/ReactDOM from CDN
- Loads the built component scripts

**Mount Point:**
```php
<!-- Carousel mount point -->
<?php 
$carouselData = isset($carouselSlides) ? $carouselSlides : [];
$carouselJson = json_encode($carouselData, JSON_HEX_APOS | JSON_HEX_QUOT);
?>
<div id="home-carousel" data-slides='<?= htmlspecialchars($carouselJson, ENT_QUOTES, 'UTF-8') ?>'></div>

<!-- Counters mount point -->
<?php 
$statsData = isset($impactStats) ? $impactStats : [];
$statsJson = json_encode($statsData, JSON_HEX_APOS | JSON_HEX_QUOT);
?>
<div id="impact-counters" data-stats='<?= htmlspecialchars($statsJson, ENT_QUOTES, 'UTF-8') ?>'></div>
```

**Script Loading:**
```php
<!-- Load React and ReactDOM from CDN -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Load our React components -->
<script src="<?= js_path('react/components/carousel.js') ?>"></script>
<script src="<?= js_path('react/components/counters.js') ?>"></script>
```

---

## 🔨 Build Process

### Build Commands

```bash
# Build all standalone components
cd frontend
npm run build:components

# Build individual components
npm run build:carousel
npm run build:counters
```

### Build Output

After building, you'll have:
- `public/js/react/components/carousel.js` - Standalone carousel bundle
- `public/js/react/components/counters.js` - Standalone counters bundle

These files are:
- Self-contained (except React/ReactDOM from CDN)
- Include React Bootstrap and other dependencies
- Ready to be included as `<script>` tags

---

## 📊 Data Flow

```
┌─────────────────┐
│  CI4 Controller │
│  (Home.php)     │
└────────┬────────┘
         │
         │ Prepares data arrays
         ▼
┌─────────────────┐
│   CI4 View      │
│  (index.php)    │
└────────┬────────┘
         │
         │ 1. Creates mount point with data-* attribute
         │ 2. Loads React/ReactDOM from CDN
         │ 3. Loads component script
         ▼
┌─────────────────┐
│   Browser       │
│   (DOM)         │
└────────┬────────┘
         │
         │ Component script executes
         │ - Finds mount point by ID
         │ - Reads data from data-* attribute
         │ - Parses JSON
         │ - Mounts React component
         ▼
┌─────────────────┐
│  React Component│
│  (Rendered)     │
└─────────────────┘
```

---

## 🎯 Key Features

### 1. **Server-Side Data**
- Data is prepared in PHP (can come from database, API, etc.)
- Passed to view as PHP variables
- Serialized to JSON in the view
- Embedded in HTML as `data-*` attributes

### 2. **Client-Side Rendering**
- React components mount after page load
- Read data from DOM attributes
- Render interactively
- Handle user interactions

### 3. **SEO Friendly**
- Initial HTML is server-rendered
- Search engines see the content
- React enhances interactivity after load

### 4. **Performance**
- React/ReactDOM loaded from CDN (cached)
- Components are separate bundles (load only what's needed)
- No full page reloads for component interactions

---

## ➕ Adding New Components

To add a new standalone React component:

1. **Create the component** in `frontend/src/components/standalone/`
   ```jsx
   // MyNewComponent.jsx
   function MyNewComponent({ data }) {
     return <div>{/* Component JSX */}</div>;
   }
   export default MyNewComponent;
   ```

2. **Create an entry point** in `frontend/src/components/standalone/entry-points/`
   ```javascript
   // mynewcomponent.js
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import MyNewComponent from '../../standalone/MyNewComponent';

   const mountComponent = () => {
     const element = document.getElementById('my-new-component');
     if (element && !element.hasAttribute('data-mounted')) {
       const data = JSON.parse(element.getAttribute('data-props'));
       const root = ReactDOM.createRoot(element);
       root.render(React.createElement(MyNewComponent, data));
       element.setAttribute('data-mounted', 'true');
     }
   };

   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', mountComponent);
   } else {
     mountComponent();
   }
   ```

3. **Create a Vite config** in `frontend/`
   ```javascript
   // vite.mynewcomponent.config.js
   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: '../public/js/react/components',
       lib: {
         entry: path.resolve(__dirname, 'src/components/standalone/entry-points/mynewcomponent.js'),
         formats: ['iife'],
       },
       // ... similar to carousel.config.js
     },
   });
   ```

4. **Add build script** to `frontend/package.json`
   ```json
   {
     "scripts": {
       "build:mynewcomponent": "vite build --config vite.mynewcomponent.config.js"
     }
   }
   ```

5. **Use in CI4 view**
   ```php
   <!-- Mount point -->
   <div id="my-new-component" data-props='<?= htmlspecialchars(json_encode($data), ENT_QUOTES, 'UTF-8') ?>'></div>

   <!-- Script -->
   <script src="<?= js_path('react/components/mynewcomponent.js') ?>"></script>
   ```

---

## 🔍 Troubleshooting

### Component not mounting?
- Check browser console for errors
- Verify mount point ID matches in view and entry point
- Ensure data attribute is properly JSON-encoded
- Check that React/ReactDOM are loaded before component script

### Data not appearing?
- Verify data is passed from controller to view
- Check JSON encoding (use `JSON_HEX_APOS | JSON_HEX_QUOT`)
- Verify data attribute name matches in entry point

### Build errors?
- Ensure all dependencies are installed (`npm install`)
- Check Vite config paths are correct
- Verify entry point file exists

---

## 📚 Related Files

- **Component Source**: `frontend/src/components/standalone/`
- **Built Components**: `public/js/react/components/`
- **Vite Configs**: `frontend/vite.*.config.js`
- **CI4 Views**: `app/Views/home/index.php`
- **CI4 Controllers**: `app/Controllers/Home.php`

---

## 🎓 Summary

The hybrid approach uses:
1. **CI4** for server-side rendering and data preparation
2. **React** for interactive client-side components
3. **Standalone bundles** for easy embedding
4. **Data attributes** for passing server data to React
5. **CDN** for React/ReactDOM to reduce bundle size

This gives you the best of both worlds: SEO-friendly server rendering with modern React interactivity!

