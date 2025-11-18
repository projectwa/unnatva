<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title><?= esc($title ?? 'UNNATVA') ?></title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="keywords">
    <meta content="" name="description">
    <?= view('layouts/head') ?>
</head>

<body class="<?= esc($bodyClass ?? '') ?>">
    <?= view('layouts/header') ?>
    
    <?= $this->renderSection('content') ?>
    
    <?= view('layouts/footer') ?>
</body>

</html>

