<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title><?= esc($title ?? 'UNNATVA Foundation') ?></title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="UNNATVA Foundation empowers underserved communities across India through sustainable livelihood initiatives, entrepreneurship development, and skill training programs." name="description">
    <meta content="NGO India, skill development, entrepreneurship training, women empowerment, education, UNNATVA Foundation" name="keywords">
    
    <?= view('layouts/head') ?>
</head>
<body>
    <!-- React SPA will mount here -->
    <div id="root"></div>
    
    <!-- JavaScript Libraries (needed for page functionality) -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<?= lib_path('wow/wow.min.js') ?>"></script>
    <script src="<?= lib_path('easing/easing.min.js') ?>"></script>
    <script src="<?= lib_path('waypoints/waypoints.min.js') ?>"></script>
    <script src="<?= lib_path('owlcarousel/owl.carousel.min.js') ?>"></script>
    <script src="<?= lib_path('slick/slick.min.js') ?>"></script>
    <script src="<?= lib_path('counterup/counterup.min.js') ?>"></script>
    <script src="<?= lib_path('lightbox/js/lightbox.min.js') ?>" type="text/javascript"></script>
    <script src="<?= js_path('main.js') ?>"></script>
    
    <!-- React and ReactDOM from CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- React SPA bundle -->
    <script src="<?= js_path('react/app.js') ?>"></script>
</body>
</html>

