<?php
// CI4 production error handler - uses our generic othererrors view
// This is used when display_errors is off and no specific error_{code}.php exists
$statusCode = $statusCode ?? 500;
$errorTitle = 'An Error Occurred';
$errorMessage = 'An error occurred while processing your request. Please try again later.';

// Use our generic error view
echo view('errors/html/othererrors', [
    'statusCode' => $statusCode,
    'errorTitle' => $errorTitle,
    'errorMessage' => $errorMessage,
]);

