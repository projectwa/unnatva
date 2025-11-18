<?php

/**
 * Site Helper Functions
 * 
 * Replaces the old includes/config.php constants
 * Provides helper functions for paths and URLs
 * 
 * Note: These functions use CI4's base_url() helper
 * Make sure the 'url' helper is loaded in BaseController
 */

if (!function_exists('img_path')) {
    /**
     * Get image path URL
     * Replaces S_IMGPATH constant
     * 
     * @param string $file Image filename (e.g., 'logo.png')
     * @return string Full URL to the image
     */
    function img_path(string $file = ''): string
    {
        if (empty($file)) {
            return base_url('img/');
        }
        return base_url('img/' . ltrim($file, '/'));
    }
}

if (!function_exists('css_path')) {
    /**
     * Get CSS path URL
     * Replaces S_CSSPATH constant
     * 
     * @param string $file CSS filename (e.g., 'custom.css')
     * @return string Full URL to the CSS file
     */
    function css_path(string $file = ''): string
    {
        if (empty($file)) {
            return base_url('assets/css/');
        }
        return base_url('assets/css/' . ltrim($file, '/'));
    }
}

if (!function_exists('js_path')) {
    /**
     * Get JavaScript path URL
     * Replaces S_JSPATH constant
     * 
     * @param string $file JS filename (e.g., 'main.js')
     * @return string Full URL to the JS file
     */
    function js_path(string $file = ''): string
    {
        if (empty($file)) {
            return base_url('js/');
        }
        return base_url('js/' . ltrim($file, '/'));
    }
}

if (!function_exists('lib_path')) {
    /**
     * Get library path URL
     * 
     * @param string $file Library file path (e.g., 'owlcarousel/owl.carousel.min.js')
     * @return string Full URL to the library file
     */
    function lib_path(string $file = ''): string
    {
        if (empty($file)) {
            return base_url('lib/');
        }
        return base_url('lib/' . ltrim($file, '/'));
    }
}

