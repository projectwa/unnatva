<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AdminAuthFilter implements FilterInterface
{
    /**
     * Do whatever processing this filter needs to do.
     * By default it should not return anything during
     * normal execution. However, when an abnormal state
     * is found, it should return an instance of
     * CodeIgniter\HTTP\Response. If it does, script
     * execution will end and that Response will be
     * sent back to the client, allowing for error pages,
     * redirects, etc.
     *
     * @param RequestInterface $request
     * @param array|null       $arguments
     *
     * @return mixed
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        // Skip authentication for login and check endpoints
        $uri = $request->getUri();
        $path = $uri->getPath();
        
        if (strpos($path, '/auth/login') !== false || 
            strpos($path, '/auth/check') !== false) {
            return;
        }

        // Check for authentication token - try multiple methods to get the header
        $token = $request->getHeaderLine('Authorization');
        if (empty($token)) {
            // Try lowercase
            $token = $request->getHeaderLine('authorization');
        }
        // Also check $_SERVER directly as fallback
        if (empty($token)) {
            $headers = $request->getHeaders();
            foreach ($headers as $name => $value) {
                if (strtolower($name) === 'authorization') {
                    $token = is_array($value) ? $value[0] : $value;
                    break;
                }
            }
        }
        if (empty($token) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $token = $_SERVER['HTTP_AUTHORIZATION'];
        }
        if (empty($token) && function_exists('apache_request_headers')) {
            $apacheHeaders = apache_request_headers();
            if (isset($apacheHeaders['Authorization'])) {
                $token = $apacheHeaders['Authorization'];
            } elseif (isset($apacheHeaders['authorization'])) {
                $token = $apacheHeaders['authorization'];
            }
        }
        
        $token = str_replace('Bearer ', '', $token);
        $token = trim($token);
        
        $sessionToken = session()->get('admin_token');
        
        if (empty($token) || $token !== $sessionToken) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['error' => 'Unauthorized', 'message' => 'Authentication required']);
        }

        // Verify user is still active
        $userId = session()->get('admin_user_id');
        if ($userId) {
            $userModel = new \App\Models\UserModel();
            $user = $userModel->find($userId);
            
            if (!$user || !$user->is_active) {
                session()->destroy();
                return service('response')
                    ->setStatusCode(403)
                    ->setJSON(['error' => 'Forbidden', 'message' => 'Account is disabled']);
            }
        }
    }

    /**
     * Allows After filters to inspect and modify the response
     * object as needed. This method does not allow any way
     * to stop execution of other after filters, short of
     * throwing an Exception or Error.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null         $arguments
     *
     * @return mixed
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Nothing to do after
    }
}



