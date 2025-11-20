<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\EnquiryModel;
use App\Models\EnquiryFollowUpModel;
use App\Models\EnquiryStatusHistoryModel;

class Enquiries extends BaseController
{
    protected $enquiryModel;
    protected $followUpModel;
    protected $statusHistoryModel;

    public function __construct()
    {
        $this->enquiryModel = new EnquiryModel();
        $this->followUpModel = new EnquiryFollowUpModel();
        $this->statusHistoryModel = new EnquiryStatusHistoryModel();
    }

    /**
     * List all enquiries with optional filters
     */
    public function index()
    {
        try {
            $status = $this->request->getGet('status');
            $sourcePage = $this->request->getGet('source_page');
            $search = $this->request->getGet('search');
            
            $query = $this->enquiryModel->orderBy('created_at', 'DESC');
            
            if ($status) {
                $query->where('status', $status);
            }
            
            if ($sourcePage) {
                $query->where('source_page', $sourcePage);
            }
            
            if ($search) {
                $query->groupStart()
                      ->like('name', $search)
                      ->orLike('email', $search)
                      ->orLike('contact_number', $search)
                      ->orLike('city', $search)
                      ->orLike('message', $search)
                      ->groupEnd();
            }
            
            $enquiries = $query->findAll();
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $enquiries
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Enquiries::index: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Get single enquiry
     */
    public function show($id)
    {
        $enquiry = $this->enquiryModel->find($id);
        
        if (!$enquiry) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Enquiry not found']);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => $enquiry
        ]);
    }

    /**
     * Update enquiry status/notes
     */
    public function update($id)
    {
        try {
            $enquiry = $this->enquiryModel->find($id);
            
            if (!$enquiry) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Enquiry not found']);
            }

            $data = $this->request->getJSON(true);
            
            // Only allow updating status and notes
            $allowedFields = ['status', 'notes'];
            $updateData = array_intersect_key($data, array_flip($allowedFields));
            
            // Track status change
            if (isset($updateData['status']) && $updateData['status'] !== $enquiry->status) {
                try {
                    $this->statusHistoryModel->skipValidation(true);
                    $this->statusHistoryModel->insert([
                        'enquiry_id' => $id,
                        'old_status' => $enquiry->status,
                        'new_status' => $updateData['status'],
                        'changed_at' => date('Y-m-d H:i:s')
                    ]);
                } catch (\Throwable $historyError) {
                    // Log but don't fail the update if history table doesn't exist
                    log_message('warning', 'Failed to record status history: ' . $historyError->getMessage());
                }
            }
            
            $this->enquiryModel->skipValidation(true);
            
            if (!$this->enquiryModel->update($id, $updateData)) {
                $errors = $this->enquiryModel->errors();
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Update failed',
                        'errors' => $errors
                    ]);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Enquiry updated successfully',
                'data' => $this->enquiryModel->find($id)
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Enquiries::update: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Get follow-ups for an enquiry
     */
    public function getFollowUps($id)
    {
        try {
            $enquiry = $this->enquiryModel->find($id);
            
            if (!$enquiry) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Enquiry not found']);
            }

            // Check if table exists, if not return empty array
            try {
                $followUps = $this->followUpModel
                    ->where('enquiry_id', $id)
                    ->orderBy('created_at', 'DESC')
                    ->findAll();
            } catch (\Throwable $dbError) {
                // Table might not exist yet - return empty array
                log_message('warning', 'Follow-ups table may not exist: ' . $dbError->getMessage());
                $followUps = [];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $followUps
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Enquiries::getFollowUps: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage(),
                    'trace' => ENVIRONMENT === 'development' ? $e->getTraceAsString() : null
                ]);
        }
    }

    /**
     * Add a follow-up to an enquiry
     */
    public function addFollowUp($id)
    {
        try {
            $enquiry = $this->enquiryModel->find($id);
            
            if (!$enquiry) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Enquiry not found']);
            }

            $data = $this->request->getJSON(true);
            
            if (empty($data['follow_up_text'])) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Follow-up text is required']);
            }

            $followUpData = [
                'enquiry_id' => $id,
                'follow_up_text' => $data['follow_up_text']
            ];

            $this->followUpModel->skipValidation(true);
            
            if (!$this->followUpModel->insert($followUpData)) {
                $errors = $this->followUpModel->errors();
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Failed to add follow-up',
                        'errors' => $errors
                    ]);
            }

            $followUp = $this->followUpModel->find($this->followUpModel->getInsertID());

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Follow-up added successfully',
                'data' => $followUp
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Enquiries::addFollowUp: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage(),
                    'trace' => ENVIRONMENT === 'development' ? $e->getTraceAsString() : null
                ]);
        }
    }

    /**
     * Get status history for an enquiry
     */
    public function getStatusHistory($id)
    {
        try {
            $enquiry = $this->enquiryModel->find($id);
            
            if (!$enquiry) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Enquiry not found']);
            }

            // Check if table exists, if not return empty array
            try {
                $history = $this->statusHistoryModel
                    ->where('enquiry_id', $id)
                    ->orderBy('changed_at', 'DESC')
                    ->findAll();
            } catch (\Throwable $dbError) {
                // Table might not exist yet - return empty array
                log_message('warning', 'Status history table may not exist: ' . $dbError->getMessage());
                $history = [];
            }

            return $this->response->setJSON([
                'success' => true,
                'data' => $history
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Enquiries::getStatusHistory: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage(),
                    'trace' => ENVIRONMENT === 'development' ? $e->getTraceAsString() : null
                ]);
        }
    }

    /**
     * Delete enquiry
     */
    public function delete($id)
    {
        try {
            $enquiry = $this->enquiryModel->find($id);
            
            if (!$enquiry) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Enquiry not found']);
            }

            $this->enquiryModel->delete($id);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Enquiry deleted successfully'
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Enquiries::delete: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Export enquiries to Excel format (CSV)
     */
    public function exportExcel()
    {
        try {
            $status = $this->request->getGet('status');
            $sourcePage = $this->request->getGet('source_page');
            
            $query = $this->enquiryModel->orderBy('created_at', 'DESC');
            
            if ($status) {
                $query->where('status', $status);
            }
            
            if ($sourcePage) {
                $query->where('source_page', $sourcePage);
            }
            
            $enquiries = $query->findAll();

            // Build CSV content
            $csvContent = '';

            // Add BOM for UTF-8 Excel compatibility
            $csvContent .= chr(0xEF).chr(0xBB).chr(0xBF);

            // Headers
            $headers = [
                'ID',
                'Name',
                'Company Name',
                'Email',
                'Business Email',
                'Contact Number',
                'City',
                'Areas of Interest',
                'Message',
                'Source Page',
                'Status',
                'Notes',
                'Created Date'
            ];
            $csvContent .= $this->arrayToCsv($headers) . "\n";

            // Data rows
            foreach ($enquiries as $enquiry) {
                // Parse areas_of_interest JSON if it exists
                $areasOfInterest = '';
                if (!empty($enquiry->areas_of_interest)) {
                    $areas = json_decode($enquiry->areas_of_interest, true);
                    if (is_array($areas)) {
                        $areasOfInterest = implode(', ', $areas);
                    } else {
                        $areasOfInterest = $enquiry->areas_of_interest;
                    }
                }
                
                $row = [
                    $enquiry->id ?? '',
                    $enquiry->name ?? '',
                    $enquiry->company_name ?? '',
                    $enquiry->email ?? '',
                    $enquiry->business_email ?? '',
                    $enquiry->contact_number ?? '',
                    $enquiry->city ?? '',
                    $areasOfInterest,
                    $enquiry->message ?? '',
                    $enquiry->source_page ?? '',
                    $enquiry->status ?? 'new',
                    $enquiry->notes ?? '',
                    $enquiry->created_at ?? ''
                ];
                $csvContent .= $this->arrayToCsv($row) . "\n";
            }

            // Set headers for CSV file download (Excel can open CSV)
            return $this->response
                ->setHeader('Content-Type', 'text/csv; charset=UTF-8')
                ->setHeader('Content-Disposition', 'attachment; filename="enquiries_' . date('Y-m-d') . '.csv"')
                ->setBody($csvContent);
        } catch (\Throwable $e) {
            log_message('error', 'Error in Enquiries::exportExcel: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Convert array to CSV row
     */
    private function arrayToCsv($array)
    {
        $output = fopen('php://temp', 'r+');
        fputcsv($output, $array);
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        return rtrim($csv, "\n");
    }
}

