<?php
/**
 * Debug script for Home page
 * Check if data is being passed correctly
 */

// Enable error display
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Simulate what the controller does
$carouselSlides = [
    [
        'heading' => "Partner with Us to Empower Tomorrow's Changemakers",
        'highlightedWords' => ['Changemakers'],
        'image' => 'banner-slider-1.png'
    ]
];

$impactStats = [
    [
        'value' => '4519',
        'suffix' => '+',
        'text' => 'Beneficiaries Impacted',
        'bg' => 'counter-bg-1.svg'
    ]
];

echo "<h1>Debug Test</h1>";
echo "<h2>Carousel Slides:</h2>";
echo "<pre>" . print_r($carouselSlides, true) . "</pre>";

echo "<h2>JSON Encoded:</h2>";
$json = json_encode($carouselSlides);
echo "<pre>" . htmlspecialchars($json, ENT_QUOTES, 'UTF-8') . "</pre>";

echo "<h2>Impact Stats:</h2>";
echo "<pre>" . print_r($impactStats, true) . "</pre>";

$json2 = json_encode($impactStats);
echo "<h2>JSON Encoded:</h2>";
echo "<pre>" . htmlspecialchars($json2, ENT_QUOTES, 'UTF-8') . "</pre>";

echo "<h2>Test HTML Output:</h2>";
echo '<div id="home-carousel" data-slides=\'' . htmlspecialchars(json_encode($carouselSlides), ENT_QUOTES, 'UTF-8') . '\'></div>';
echo '<div id="impact-counters" data-stats=\'' . htmlspecialchars(json_encode($impactStats), ENT_QUOTES, 'UTF-8') . '\'></div>';

