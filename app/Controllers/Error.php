<?php

namespace App\Controllers;

use CodeIgniter\Exceptions\PageNotFoundException;

class Error extends BaseController
{
    /**
     * Initialize controller
     * Required by CI4
     */
    public function initController(\CodeIgniter\HTTP\RequestInterface $request, \CodeIgniter\HTTP\ResponseInterface $response, \Psr\Log\LoggerInterface $logger)
    {
        parent::initController($request, $response, $logger);
    }

    /**
     * Display error page
     * Accessible via /error_document route
     * Can display any error code by passing ?code=XXX
     */
    public function index()
    {
        $statusCode = (int) ($this->request->getGet('code') ?? 404);
        
        // Set HTTP status code
        $this->response->setStatusCode($statusCode);
        
        // Determine which view to use
        $view = $this->getErrorView($statusCode);
        $data = $this->getErrorData($statusCode);
        
        return view($view, $data);
    }

    /**
     * Handle 404 errors
     * Called automatically by CI4 when a page is not found
     */
    public function show404()
    {
        // Set HTTP status code to 404
        $this->response->setStatusCode(404);
        
        return view('errors/html/404');
    }

    /**
     * Handle other error codes
     * Can be called for 500, 403, etc.
     */
    public function showError(int $statusCode = 500)
    {
        // Set HTTP status code
        $this->response->setStatusCode($statusCode);
        
        // Determine which view to use
        $view = $this->getErrorView($statusCode);
        $data = $this->getErrorData($statusCode);
        
        return view($view, $data);
    }

    /**
     * Get the appropriate error view based on status code
     */
    private function getErrorView(int $statusCode): string
    {
        if ($statusCode === 404) {
            return 'errors/html/404';
        }
        
        if ($statusCode === 500) {
            return 'errors/html/500';
        }
        
        // For other error codes, use the generic othererrors view
        return 'errors/html/othererrors';
    }

    /**
     * Get error data for the view
     */
    private function getErrorData(int $statusCode): array
    {
        $errorMessages = [
            400 => ['Bad Request', 'The request was invalid or cannot be processed.'],
            401 => ['Unauthorized', 'You need to be authenticated to access this resource.'],
            403 => ['Forbidden', 'You do not have permission to access this resource.'],
            404 => ['Page Not Found', 'The page you are looking for does not exist.'],
            405 => ['Method Not Allowed', 'The request method is not allowed for this resource.'],
            408 => ['Request Timeout', 'The request took too long to process.'],
            429 => ['Too Many Requests', 'You have made too many requests. Please try again later.'],
            500 => ['Internal Server Error', 'An internal server error occurred.'],
            502 => ['Bad Gateway', 'The server received an invalid response.'],
            503 => ['Service Unavailable', 'The service is temporarily unavailable.'],
            504 => ['Gateway Timeout', 'The server did not receive a timely response.'],
        ];

        $errorInfo = $errorMessages[$statusCode] ?? [
            'Error ' . $statusCode,
            'An error occurred while processing your request.'
        ];

        return [
            'statusCode' => $statusCode,
            'errorTitle' => $errorInfo[0],
            'errorMessage' => $errorInfo[1],
        ];
    }
}

