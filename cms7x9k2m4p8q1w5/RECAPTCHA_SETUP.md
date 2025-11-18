# reCAPTCHA Setup Guide

## Overview

The CMS uses Google reCAPTCHA v3 to protect the login form from brute-force attacks. reCAPTCHA v3 runs invisibly in the background and provides a risk score. After 2 failed login attempts, reCAPTCHA verification is automatically performed on form submission.

## Frontend Configuration (React)

### Environment Detection

The system automatically detects your environment:

- **Local Development** (`lhunnatva`, `localhost`): Uses Google's test key automatically
- **Production** (`unnatva.org`): Uses the key from `.env` file

### Setup

1. **For Local Development**: No configuration needed! The test key is used automatically.

2. **For Production**: Create a `.env` file in the `cms7x9k2m4p8q1w5/` directory:

```env
VITE_RECAPTCHA_SITE_KEY=your-production-site-key-here
```

3. Get your reCAPTCHA keys from: https://www.google.com/recaptcha/admin

## Backend Configuration (PHP/CodeIgniter)

### Do You Need the Secret Key?

**Yes, but only on the backend!**

- **Site Key (Public Key)**: Used in the React frontend - already configured ✅
- **Secret Key**: Used in the PHP backend to verify tokens - **needs to be added**

### Why You Need the Secret Key

The frontend sends a reCAPTCHA token to your backend. The backend must verify this token with Google's servers using the **secret key**. Without verification, anyone could bypass reCAPTCHA by sending fake tokens.

### Backend Setup

1. Add the secret key to your CodeIgniter `.env` file (in the project root):

```env
RECAPTCHA_SECRET_KEY=your-secret-key-here
```

2. Update `app/Controllers/Admin/Auth.php` to verify reCAPTCHA v3 tokens:

```php
// In the login() method, before verifying credentials:

// Get reCAPTCHA token from request
$recaptchaToken = $this->request->getJSON(true)['recaptcha_token'] ?? null;

// If reCAPTCHA is required (after 2 failed attempts), verify it
if ($recaptchaToken) {
    $secretKey = getenv('RECAPTCHA_SECRET_KEY') ?: config('Recaptcha')->secretKey;
    
    $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => $secretKey,
        'response' => $recaptchaToken,
        'remoteip' => $this->request->getIPAddress()
    ];
    
    $ch = curl_init($verifyUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    
    $result = json_decode($response, true);
    
    // reCAPTCHA v3 returns a score (0.0 to 1.0)
    // Score >= 0.5 is typically considered human
    // Adjust threshold based on your security needs
    $scoreThreshold = 0.5;
    
    if (!$result || !$result['success']) {
        return $this->response
            ->setStatusCode(400)
            ->setJSON(['error' => 'reCAPTCHA verification failed']);
    }
    
    // Check score for v3
    $score = $result['score'] ?? 0.0;
    if ($score < $scoreThreshold) {
        return $this->response
            ->setStatusCode(400)
            ->setJSON(['error' => 'reCAPTCHA verification failed. Please try again.']);
    }
}
```

### reCAPTCHA v3 vs v2

- **v3**: Invisible, runs automatically, returns a score (0.0-1.0)
- **v2**: Shows a checkbox challenge
- **Current Implementation**: v3 (invisible, score-based)

### Test Key Behavior

- **Test Site Key (v2)**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- **Test Secret Key (v2)**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`
- **Note**: For v3, Google doesn't provide test keys. Use your actual v3 keys for both development and production.
- **Local Development**: The code uses a fallback test key for v2 compatibility, but you should use your actual v3 keys.

## Summary

| Key Type | Location | Purpose | Required? |
|----------|----------|---------|-----------|
| **Site Key** | Frontend (`.env` in `cms7x9k2m4p8q1w5/`) | Display reCAPTCHA widget | ✅ Yes (for production) |
| **Secret Key** | Backend (`.env` in project root) | Verify tokens on server | ✅ Yes (for security) |

## Current Status

- ✅ Frontend: Automatically uses test key locally, env key in production
- ✅ Backend: reCAPTCHA v3 verification implemented in `Auth.php`

## Implementation Details

The backend verification:
- Verifies the token with Google's API using your secret key
- Checks the score (v3 returns 0.0-1.0, threshold is 0.5)
- Returns appropriate error messages if verification fails
- Logs verification attempts for debugging

### Score Threshold

The default score threshold is **0.5**. You can adjust this in `app/Controllers/Admin/Auth.php` in the `verifyRecaptcha()` method:

```php
$scoreThreshold = 0.5; // Adjust this value (0.0 to 1.0)
```

- **0.5-1.0**: Likely human (default threshold)
- **0.3-0.5**: Suspicious, may require additional verification
- **0.0-0.3**: Likely bot

## Next Steps

1. ✅ Get your reCAPTCHA v3 keys from Google
2. ✅ Add `VITE_RECAPTCHA_SITE_KEY` to `cms7x9k2m4p8q1w5/.env` for production
3. ✅ Add `RECAPTCHA_SECRET_KEY` to project root `.env` for backend verification
4. ✅ Backend verification implemented in `Auth.php`

