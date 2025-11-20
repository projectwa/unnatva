<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// SPA route (serves React app - header/footer don't reload)
// React Router handles client-side routing for all pages
$routes->get('/', 'Spa::index');

// About page - now uses React SPA (client-side routing handles /about)
// Commented out so React SPA handles it
// $routes->get('about', 'About::index');
// $routes->get('about/', 'About::index');

// Contact page
$routes->get('contact', 'Contact::index');
$routes->get('contact/', 'Contact::index');

// Impact page
$routes->get('impact', 'Impact::index');
$routes->get('impact/', 'Impact::index');

// Success Stories page - Now handled by React SPA (catch-all route)
// Commented out so React SPA handles it and loads data from database
// $routes->get('success-stories', 'SuccessStories::index');
// $routes->get('success-stories/', 'SuccessStories::index');

// Initiatives pages
$routes->get('entrepreneurship-development', 'Initiatives::entrepreneurship');
$routes->get('entrepreneurship-development/', 'Initiatives::entrepreneurship');
$routes->get('skill-development', 'Initiatives::skill');
$routes->get('skill-development/', 'Initiatives::skill');
$routes->get('education', 'Initiatives::education');
$routes->get('education/', 'Initiatives::education');
$routes->get('women-empowerment', 'Initiatives::women');
$routes->get('women-empowerment/', 'Initiatives::women');

// Media page
$routes->get('media', 'Media::index');
$routes->get('media/', 'Media::index');

// Privacy Policy page
$routes->get('privacy-policy', 'PrivacyPolicy::index');
$routes->get('privacy-policy/', 'PrivacyPolicy::index');

// Error page (accessible via /error_document)
$routes->get('error_document', 'Error::index');
$routes->get('error_document/', 'Error::index');

// Set 404 override to use Error controller
$routes->set404Override('Error::show404');

// API Routes for SPA content
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function($routes) {
    $routes->get('pages/home', 'Pages::getHomePage');
    $routes->get('pages/about', 'Pages::getAboutPage');
    $routes->get('pages/contact', 'Pages::getContactPage');
    $routes->get('pages/impact', 'Pages::getImpactPage');
    $routes->get('pages/success-stories', 'Pages::getSuccessStoriesPage');
    $routes->get('pages/initiatives/(:segment)', 'Pages::getInitiativesPage/$1');
    $routes->get('pages/media', 'Pages::getMediaPage');
    $routes->get('pages/privacy-policy', 'Pages::getPrivacyPolicyPage');
    
    // Public API routes for job application submission (no auth required)
    $routes->post('job-applications', 'JobApplications::create');
    $routes->post('job-applications/upload-resume', 'JobApplications::uploadResume');
    
    // Public API routes for enquiry submission (no auth required)
    $routes->post('enquiries', 'Enquiries::create');
    
    // Public API routes for media (no auth required)
    $routes->get('media/categories', 'Media::getCategories');
    $routes->get('media/by-category', 'Media::getByCategory');
    
    // Public API routes for success stories (no auth required)
    $routes->get('success-stories', 'SuccessStories::index');
    $routes->get('success-stories/slug/(:segment)', 'SuccessStories::getBySlug/$1');
});

// Admin CMS Routes
$routes->group('cms7x9k2m4p8q1w5', ['namespace' => 'App\Controllers\Admin'], function($routes) {
    // Admin API routes - MUST come BEFORE the catch-all route
    $routes->group('api', ['namespace' => 'App\Controllers\Admin'], function($routes) {
        // Authentication routes (no auth required)
        $routes->post('auth/login', 'Auth::login');
        $routes->post('auth/logout', 'Auth::logout', ['filter' => 'adminAuth']);
        $routes->get('auth/check', 'Auth::check');
        
        // Protected routes (require authentication)
        $routes->group('', ['filter' => 'adminAuth'], function($routes) {
            // Auth
            $routes->post('auth/change-password', 'Auth::changePassword');
            
            // Dashboard
            $routes->get('dashboard/stats', 'Dashboard::stats');
            
            // Pages CRUD
            $routes->get('pages', 'Pages::index');
            $routes->get('pages/(:num)', 'Pages::show/$1');
            $routes->post('pages', 'Pages::create');
            $routes->put('pages/(:num)', 'Pages::update/$1');
            $routes->delete('pages/(:num)', 'Pages::delete/$1');
            
            // Carousel CRUD
            $routes->get('carousel', 'Carousel::index');
            $routes->get('carousel/(:num)', 'Carousel::show/$1');
            $routes->post('carousel', 'Carousel::create');
            $routes->put('carousel/(:num)', 'Carousel::update/$1');
            $routes->delete('carousel/(:num)', 'Carousel::delete/$1');
            $routes->post('carousel/upload-image', 'Carousel::uploadImage');
            
            // Impact Stats CRUD
            $routes->get('impact-stats', 'ImpactStats::index');
            $routes->get('impact-stats/(:num)', 'ImpactStats::show/$1');
            $routes->post('impact-stats', 'ImpactStats::create');
            $routes->put('impact-stats/(:num)', 'ImpactStats::update/$1');
            $routes->delete('impact-stats/(:num)', 'ImpactStats::delete/$1');
            
            // Success Stories CRUD
            $routes->get('success-stories', 'SuccessStories::index');
            $routes->get('success-stories/(:num)', 'SuccessStories::show/$1');
            $routes->post('success-stories', 'SuccessStories::create');
            $routes->put('success-stories/(:num)', 'SuccessStories::update/$1');
            $routes->delete('success-stories/(:num)', 'SuccessStories::delete/$1');
            $routes->post('success-stories/upload-image', 'SuccessStories::uploadImage');
            
            // Media Items CRUD
            $routes->get('media-items', 'Media::index');
            $routes->get('media-items/(:num)', 'Media::show/$1');
            $routes->post('media-items', 'Media::create');
            $routes->put('media-items/(:num)', 'Media::update/$1');
            $routes->delete('media-items/(:num)', 'Media::delete/$1');
            $routes->post('media-items/upload', 'Media::uploadMultiple');
            $routes->put('media-items/(:num)/caption-alt', 'Media::updateCaptionAlt/$1');
            
            // Media Categories CRUD
            $routes->get('media-categories', 'MediaCategories::index');
            $routes->get('media-categories/(:num)', 'MediaCategories::show/$1');
            $routes->post('media-categories', 'MediaCategories::create');
            $routes->put('media-categories/(:num)', 'MediaCategories::update/$1');
            $routes->delete('media-categories/(:num)', 'MediaCategories::delete/$1');
            $routes->post('media-categories/(:num)/toggle-active', 'MediaCategories::toggleActive/$1');
            
            // Settings CRUD
            $routes->get('settings', 'Settings::index');
            $routes->get('settings/(:num)', 'Settings::show/$1');
            $routes->post('settings', 'Settings::create');
            $routes->put('settings/(:num)', 'Settings::update/$1');
            $routes->post('settings/bulk-update', 'Settings::bulkUpdate');
            $routes->delete('settings/(:num)', 'Settings::delete/$1');
            
            // Content Blocks CRUD (for "What's Happening" section)
            $routes->get('content-blocks', 'ContentBlocks::index');
            $routes->get('content-blocks/(:num)', 'ContentBlocks::show/$1');
            $routes->post('content-blocks', 'ContentBlocks::create');
            $routes->put('content-blocks/(:num)', 'ContentBlocks::update/$1');
            $routes->delete('content-blocks/(:num)', 'ContentBlocks::delete/$1');
            $routes->post('content-blocks/upload-image', 'ContentBlocks::uploadImage');
            
            // Job Applications CRUD
            $routes->get('job-applications', 'JobApplications::index');
            $routes->get('job-applications/(:num)', 'JobApplications::show/$1');
            $routes->put('job-applications/(:num)', 'JobApplications::update/$1');
            $routes->delete('job-applications/(:num)', 'JobApplications::delete/$1');
            $routes->get('job-applications/(:num)/download-resume', 'JobApplications::downloadResume/$1');
            $routes->get('job-applications/export/excel', 'JobApplications::exportExcel');
            
            // Jobs CRUD (for "Career, Work at Unnatva" section)
            $routes->get('jobs', 'Jobs::index');
            $routes->get('jobs/(:num)', 'Jobs::show/$1');
            $routes->post('jobs', 'Jobs::create');
            $routes->put('jobs/(:num)', 'Jobs::update/$1');
            $routes->delete('jobs/(:num)', 'Jobs::delete/$1');
            
            // Job Applications CRUD (protected - requires auth)
            $routes->get('job-applications', 'JobApplications::index');
            $routes->get('job-applications/(:num)', 'JobApplications::show/$1');
            $routes->put('job-applications/(:num)', 'JobApplications::update/$1');
            $routes->delete('job-applications/(:num)', 'JobApplications::delete/$1');
            $routes->get('job-applications/(:num)/download-resume', 'JobApplications::downloadResume/$1');
            
            // Enquiries CRUD
            $routes->get('enquiries', 'Enquiries::index');
            $routes->get('enquiries/(:num)', 'Enquiries::show/$1');
            $routes->put('enquiries/(:num)', 'Enquiries::update/$1');
            $routes->delete('enquiries/(:num)', 'Enquiries::delete/$1');
            $routes->get('enquiries/export/excel', 'Enquiries::exportExcel');
            // Follow-ups
            $routes->get('enquiries/(:num)/follow-ups', 'Enquiries::getFollowUps/$1');
            $routes->post('enquiries/(:num)/follow-ups', 'Enquiries::addFollowUp/$1');
            // Status history
            $routes->get('enquiries/(:num)/status-history', 'Enquiries::getStatusHistory/$1');
        });
    });
    
    // Public API routes moved to main /api group above (outside cms7x9k2m4p8q1w5)
    
    // Admin entry point (serves React app)
    $routes->get('/', 'Index::index');
    // Catch-all for React Router (must be last, after API routes)
    $routes->get('(:any)', 'Index::index');
});

// Catch-all route for React SPA - must be LAST, after all API and admin routes
// This ensures all public routes (like /about, /contact, etc.) go through React Router
$routes->get('(:any)', 'Spa::index');

