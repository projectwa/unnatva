<?php

namespace App\Controllers\Api;

use App\Controllers\Admin\JobApplications as AdminJobApplications;

/**
 * Public API controller for job applications
 * Delegates to Admin controller but without auth requirement
 */
class JobApplications extends AdminJobApplications
{
    // This controller extends AdminJobApplications but is in the Api namespace
    // so it can be accessed without authentication
}

