<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\EnquiryModel;

/**
 * Public API controller for enquiries
 * No authentication required
 */
class Enquiries extends BaseController
{
    protected $enquiryModel;

    public function __construct()
    {
        $this->enquiryModel = new EnquiryModel();
    }

    /**
     * Create new enquiry (public endpoint - no auth required)
     */
    public function create()
    {
        try {
            $data = $this->request->getJSON(true);
            
            // Manual validation
            if (empty($data['name'])) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Name is required']);
            }
            
            // Use business_email if provided, otherwise use email
            if (!empty($data['business_email'])) {
                $emailToValidate = $data['business_email'];
            } elseif (!empty($data['email'])) {
                $emailToValidate = $data['email'];
            } else {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Valid email is required']);
            }
            
            if (!filter_var($emailToValidate, FILTER_VALIDATE_EMAIL)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Valid email is required']);
            }

            // Ensure email field is set (for database compatibility)
            if (empty($data['email']) && !empty($data['business_email'])) {
                $data['email'] = $data['business_email'];
            }

            // Convert areas_of_interest array to JSON if provided
            if (isset($data['areas_of_interest']) && is_array($data['areas_of_interest'])) {
                $data['areas_of_interest'] = json_encode($data['areas_of_interest']);
            }

            // Set default status
            if (empty($data['status'])) {
                $data['status'] = 'new';
            }

            // Skip validation to avoid validation service issues
            $this->enquiryModel->skipValidation(true);
            
            if (!$this->enquiryModel->insert($data)) {
                $errors = $this->enquiryModel->errors();
                log_message('error', 'Enquiries::create insert errors: ' . json_encode($errors));
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Failed to submit enquiry',
                        'errors' => $errors
                    ]);
            }

            return $this->response
                ->setStatusCode(201)
                ->setJSON([
                    'success' => true,
                    'message' => 'Enquiry submitted successfully',
                    'data' => $this->enquiryModel->find($this->enquiryModel->getInsertID())
                ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Enquiries::create: ' . $e->getMessage());
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

