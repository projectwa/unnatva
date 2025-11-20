<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title><?= esc($title ?? 'UNNATVA | Media') ?></title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">
    <?= view('layouts/head') ?>

</head>

<body>
    <?= view('layouts/header') ?>

    <!-- Media Gallery React Component Mount Point -->
    <div id="media-gallery" data-categories='<?= htmlspecialchars(json_encode($categories ?? [], JSON_HEX_APOS | JSON_HEX_QUOT), ENT_QUOTES, 'UTF-8') ?>'></div>

    <!-- Load React and ReactDOM from CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

    <!-- Load Media Gallery Component -->
    <script src="<?= js_path('react/components/media-gallery.js') ?>" defer></script>

    <?= view('layouts/footer') ?>

</body>

</html>
