<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;

class Auth extends BaseController
{
    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    /**
     * Login endpoint
     */
    public function login()
    {
        try {
            $requestData = $this->request->getJSON(true);
            $username = $requestData['username'] ?? '';
            $password = $requestData['password'] ?? '';
            $recaptchaToken = $requestData['recaptcha_token'] ?? null;

            if (empty($username) || empty($password)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Username and password are required']);
            }

            // Verify reCAPTCHA v3 if token is provided (required after 2 failed attempts)
            if ($recaptchaToken) {
                $verificationResult = $this->verifyRecaptcha($recaptchaToken);
                if (!$verificationResult['success']) {
                    return $this->response
                        ->setStatusCode(400)
                        ->setJSON(['error' => $verificationResult['error']]);
                }
            }

            $user = $this->userModel->verifyCredentials($username, $password);

            if (!$user) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON(['error' => 'Invalid credentials']);
            }

            if (!$user->is_active) {
                return $this->response
                    ->setStatusCode(403)
                    ->setJSON(['error' => 'Account is disabled']);
            }

            // Generate a simple token (in production, use JWT or session-based auth)
            $token = bin2hex(random_bytes(32));
            
            // Try to get session, but handle errors gracefully
            $session = null;
            try {
                $session = session();
            } catch (\Throwable $e) {
                // If session initialization fails, log error and return server error
                log_message('error', 'Session initialization failed in auth/login: ' . $e->getMessage());
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON(['error' => 'Server configuration error. Please contact administrator.']);
            }
            
            // Store token in session (you can also use database for token storage)
            $session->set('admin_token', $token);
            $session->set('admin_user_id', $user->id);
            $session->set('admin_user_role', $user->role);
            
            // Debug logging - use error level so it shows up in logs
            $sessionId = session_id();
            log_message('error', 'Login - Token stored: ' . substr($token, 0, 20) . '...');
            log_message('error', 'Login - Session ID: ' . $sessionId);
            log_message('error', 'Login - Session data keys: ' . implode(', ', array_keys($session->get())));
            
            // Verify session was set immediately
            $verifyToken = $session->get('admin_token');
            log_message('error', 'Login - Token verification: ' . ($verifyToken === $token ? 'MATCH' : 'MISMATCH'));
            
            // Check session file path - CodeIgniter FileHandler uses: savePath/sessionName + sessionId
            $sessionPath = WRITEPATH . 'session';
            $sessionConfig = config('Session');
            $sessionName = $sessionConfig->cookieName ?? 'ci_session';
            // FileHandler constructs: savePath/sessionName + sessionId (no underscore)
            $sessionFile = $sessionPath . '/' . $sessionName . $sessionId;
            log_message('error', 'Login - Session file path: ' . $sessionFile);
            log_message('error', 'Login - Session file exists: ' . (file_exists($sessionFile) ? 'YES' : 'NO'));
            log_message('error', 'Login - Session path writable: ' . (is_writable($sessionPath) ? 'YES' : 'NO'));
            
            // List all session files to see what's there
            $sessionFiles = glob($sessionPath . '/' . $sessionName . '*');
            log_message('error', 'Login - Session files found: ' . count($sessionFiles));
            if (count($sessionFiles) > 0) {
                log_message('error', 'Login - Session files: ' . implode(', ', array_map('basename', array_slice($sessionFiles, 0, 5))));
            }

            return $this->response->setJSON([
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'full_name' => $user->full_name,
                    'role' => $user->role,
                ]
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in auth/login: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON(['error' => 'Internal server error']);
        }
    }

    /**
     * Logout endpoint
     */
    public function logout()
    {
        try {
            // Try to get session, but handle errors gracefully
            $session = null;
            try {
                $session = session();
            } catch (\Throwable $e) {
                // If session initialization fails, just return success
                log_message('error', 'Session initialization failed in auth/logout: ' . $e->getMessage());
                return $this->response->setJSON([
                    'success' => true,
                    'message' => 'Logged out successfully'
                ]);
            }
            
            $session->destroy();
            
            return $this->response->setJSON([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in auth/logout: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON(['error' => 'Internal server error']);
        }
    }

    /**
     * Check authentication status
     */
    public function check()
    {
        try {
            // Try multiple ways to get the Authorization header
            $token = $this->request->getHeaderLine('Authorization');
            if (empty($token)) {
                // Try lowercase
                $token = $this->request->getHeaderLine('authorization');
            }
            // Also check $_SERVER directly as fallback
            if (empty($token)) {
                $headers = $this->request->getHeaders();
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
            
            // Debug logging - use error level so it shows up in logs
            log_message('error', 'Auth check - Token from header: ' . ($token ? substr($token, 0, 20) . '...' : 'missing'));
            log_message('error', 'Auth check - All request headers: ' . json_encode(array_keys($this->request->getHeaders())));
            log_message('error', 'Auth check - SERVER HTTP_AUTHORIZATION: ' . ($_SERVER['HTTP_AUTHORIZATION'] ?? 'not set'));
            log_message('error', 'Auth check - Session ID from cookie: ' . ($_COOKIE['ci_session'] ?? 'missing'));
            log_message('error', 'Auth check - All cookies: ' . json_encode(array_keys($_COOKIE)));
            
            // Try to get session, but handle errors gracefully
            $session = null;
            try {
                $session = session();
                $sessionId = session_id();
                log_message('error', 'Auth check - Session initialized, ID: ' . $sessionId);
                $allSessionData = $session->get();
                log_message('error', 'Auth check - Session data keys: ' . implode(', ', array_keys($allSessionData)));
                log_message('error', 'Auth check - Full session data: ' . json_encode($allSessionData));
                
                // Session is initialized and data is available - no need to read file directly
            } catch (\Throwable $e) {
                // If session initialization fails, return unauthenticated
                log_message('error', 'Session initialization failed in auth/check: ' . $e->getMessage());
                log_message('error', 'Session error stack: ' . $e->getTraceAsString());
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON(['authenticated' => false]);
            }
            
            $sessionToken = $session->get('admin_token');
            $sessionUserId = $session->get('admin_user_id');
            
            // Debug logging
            log_message('error', 'Auth check - Session token: ' . ($sessionToken ? substr($sessionToken, 0, 20) . '...' : 'missing'));
            log_message('error', 'Auth check - Session user ID: ' . ($sessionUserId ?? 'missing'));
            log_message('error', 'Auth check - Header token matches session: ' . ($token && $token === $sessionToken ? 'YES' : 'NO'));
            if ($token && $sessionToken) {
                log_message('error', 'Auth check - Token comparison: ' . ($token === $sessionToken ? 'EQUAL' : 'DIFFERENT'));
                if ($token !== $sessionToken) {
                    log_message('error', 'Auth check - Header token: ' . substr($token, 0, 40));
                    log_message('error', 'Auth check - Session token: ' . substr($sessionToken, 0, 40));
                }
            }
            
            if ($token && $token === $sessionToken) {
                $userId = $session->get('admin_user_id');
                $user = $this->userModel->find($userId);
                
                if ($user && $user->is_active) {
                    log_message('debug', 'Auth check - User authenticated: ' . $user->username);
                    return $this->response->setJSON([
                        'authenticated' => true,
                        'user' => [
                            'id' => $user->id,
                            'username' => $user->username,
                            'email' => $user->email,
                            'full_name' => $user->full_name,
                            'role' => $user->role,
                        ]
                    ]);
                } else {
                    log_message('debug', 'Auth check - User not found or inactive');
                }
            } else {
                log_message('debug', 'Auth check - Token mismatch or missing');
                if (!$token) {
                    log_message('debug', 'Auth check - No token in Authorization header');
                }
                if (!$sessionToken) {
                    log_message('debug', 'Auth check - No token in session (session might be new/empty)');
                }
            }

            return $this->response
                ->setStatusCode(401)
                ->setJSON(['authenticated' => false]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in auth/check: ' . $e->getMessage());
            log_message('error', 'Error stack: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON(['error' => 'Internal server error', 'authenticated' => false]);
        }
    }

    /**
     * Verify reCAPTCHA v3 token with Google's API
     * 
     * @param string $token The reCAPTCHA token from frontend
     * @return array ['success' => bool, 'error' => string|null]
     */
    private function verifyRecaptcha($token)
    {
        // Get secret key from environment variable
        $secretKey = getenv('RECAPTCHA_SECRET_KEY');
        if (empty($secretKey)) {
            // Try alternative method
            $secretKey = $_ENV['RECAPTCHA_SECRET_KEY'] ?? null;
        }

        if (empty($secretKey)) {
            log_message('error', 'reCAPTCHA secret key not configured in environment');
            return [
                'success' => false,
                'error' => 'reCAPTCHA configuration error. Please contact administrator.'
            ];
        }

        // Verify token with Google's API
        $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        $data = [
            'secret' => $secretKey,
            'response' => $token,
            'remoteip' => $this->request->getIPAddress()
        ];

        // Use cURL to verify
        $ch = curl_init($verifyUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            log_message('error', 'reCAPTCHA cURL error: ' . $curlError);
            return [
                'success' => false,
                'error' => 'reCAPTCHA verification failed. Please try again.'
            ];
        }

        $result = json_decode($response, true);

        if (!$result) {
            log_message('error', 'reCAPTCHA invalid JSON response: ' . $response);
            return [
                'success' => false,
                'error' => 'reCAPTCHA verification failed. Please try again.'
            ];
        }

        // Check if verification was successful
        if (!isset($result['success']) || !$result['success']) {
            $errorCodes = $result['error-codes'] ?? [];
            log_message('warning', 'reCAPTCHA verification failed: ' . implode(', ', $errorCodes));
            return [
                'success' => false,
                'error' => 'reCAPTCHA verification failed. Please try again.'
            ];
        }

        // reCAPTCHA v3 returns a score (0.0 to 1.0)
        // Score >= 0.5 is typically considered human
        // Adjust threshold based on your security needs
        $scoreThreshold = 0.5;
        $score = $result['score'] ?? 0.0;

        if ($score < $scoreThreshold) {
            log_message('warning', 'reCAPTCHA score too low: ' . $score . ' (threshold: ' . $scoreThreshold . ')');
            return [
                'success' => false,
                'error' => 'reCAPTCHA verification failed. Please try again.'
            ];
        }

        // Verification successful
        log_message('debug', 'reCAPTCHA verification successful. Score: ' . $score);
        return [
            'success' => true,
            'error' => null
        ];
    }

    /**
     * Change password endpoint
     */
    public function changePassword()
    {
        try {
            $session = session();
            $userId = $session->get('admin_user_id');
            
            if (!$userId) {
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON(['error' => 'Unauthorized']);
            }

            $requestData = $this->request->getJSON(true);
            $currentPassword = $requestData['current_password'] ?? '';
            $newPassword = $requestData['new_password'] ?? '';
            $confirmPassword = $requestData['confirm_password'] ?? '';

            if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'All password fields are required']);
            }

            if ($newPassword !== $confirmPassword) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'New password and confirm password do not match']);
            }

            if (strlen($newPassword) < 8) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'New password must be at least 8 characters long']);
            }

            // Get current user
            $user = $this->userModel->find($userId);
            if (!$user) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'User not found']);
            }

            // Verify current password
            if (!password_verify($currentPassword, $user->password)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Current password is incorrect']);
            }

            // Update password - skip validation and callbacks to avoid double hashing
            // We'll hash it manually and update directly
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            
            // Use skipValidation to bypass the beforeUpdate callback that would hash again
            $this->userModel->skipValidation(true);
            
            // Update using raw query to bypass callbacks entirely
            $db = \Config\Database::connect();
            $db->table('users')
                ->where('id', $userId)
                ->update(['password' => $hashedPassword, 'updated_at' => date('Y-m-d H:i:s')]);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in auth/changePassword: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }
}



