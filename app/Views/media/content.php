<!-- Media Page Content (no header/footer - for API) -->
<div class="page-content" data-page="media">
    <!-- Media Gallery React Component Mount Point -->
    <div id="media-gallery" data-categories='<?= htmlspecialchars(json_encode($categories ?? [], JSON_HEX_APOS | JSON_HEX_QUOT), ENT_QUOTES, 'UTF-8') ?>'></div>
</div>

<!-- Load React and ReactDOM from CDN -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Load Media Gallery Component -->
<script src="<?= js_path('react/components/media-gallery.js') ?>"></script>
