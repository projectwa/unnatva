/**
 * Get reCAPTCHA v3 site key based on environment
 * - Always tries to use environment variable first (for v3 keys)
 * - Falls back to test key only if env key is not set
 * 
 * Note: For reCAPTCHA v3, Google doesn't provide official test keys.
 * You MUST use your actual v3 keys from Google reCAPTCHA admin.
 * The test key fallback is for v2 compatibility only and won't work with v3.
 */
export function getRecaptchaSiteKey() {
  // Google's test key (v2) - fallback only (won't work with v3 API)
  const TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  
  // Always try to use environment variable first (for v3 keys)
  const envKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  
  if (envKey) {
    return envKey;
  }
  
  // Fallback to test key (v2) - will show warning
  console.warn('VITE_RECAPTCHA_SITE_KEY not set in .env file. Using test key as fallback.');
  console.warn('Note: Test key is for v2 only. For v3, you must set VITE_RECAPTCHA_SITE_KEY in .env');
  
  return TEST_KEY;
}

