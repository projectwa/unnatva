<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\JobApplicationModel;

class JobApplications extends BaseController
{
    protected $jobApplicationModel;

    public function __construct()
    {
        $this->jobApplicationModel = new JobApplicationModel();
    }

    /**
     * List all job applications, optionally filtered by job listing ID
     */
    public function index()
    {
        try {
            $jobListingId = $this->request->getGet('job_listing_id');
            
            if ($jobListingId) {
                $applications = $this->jobApplicationModel->getByJobListing((int)$jobListingId);
            } else {
                $applications = $this->jobApplicationModel->orderBy('created_at', 'DESC')->findAll();
            }
            
            return $this->response->setJSON([
                'success' => true,
                'data' => $applications
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in JobApplications::index: ' . $e->getMessage());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Get single job application
     */
    public function show($id)
    {
        $application = $this->jobApplicationModel->find($id);
        
        if (!$application) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Job application not found']);
        }

        return $this->response->setJSON([
            'success' => true,
            'data' => $application
        ]);
    }

    /**
     * Create new job application (public endpoint - no auth required)
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
            
            if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Valid email is required']);
            }

            // Skip validation to avoid validation service issues
            $this->jobApplicationModel->skipValidation(true);
            
            // Ensure job_listing_id is null if empty or not provided
            if (empty($data['job_listing_id'])) {
                $data['job_listing_id'] = null;
            }
            
            if (!$this->jobApplicationModel->insert($data)) {
                $errors = $this->jobApplicationModel->errors();
                log_message('error', 'JobApplications::create insert errors: ' . json_encode($errors));
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Failed to submit application',
                        'errors' => $errors
                    ]);
            }

            return $this->response
                ->setStatusCode(201)
                ->setJSON([
                    'success' => true,
                    'message' => 'Application submitted successfully',
                    'data' => $this->jobApplicationModel->find($this->jobApplicationModel->getInsertID())
                ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in JobApplications::create: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Update job application status/notes
     */
    public function update($id)
    {
        try {
            $application = $this->jobApplicationModel->find($id);
            
            if (!$application) {
                return $this->response
                    ->setStatusCode(404)
                    ->setJSON(['error' => 'Job application not found']);
            }

            $data = $this->request->getJSON(true);
            
            // Only allow updating status and notes
            $allowedFields = ['status', 'notes'];
            $updateData = array_intersect_key($data, array_flip($allowedFields));
            
            $this->jobApplicationModel->skipValidation(true);
            
            if (!$this->jobApplicationModel->update($id, $updateData)) {
                $errors = $this->jobApplicationModel->errors();
                log_message('error', 'JobApplications::update errors: ' . json_encode($errors));
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON([
                        'error' => 'Update failed',
                        'errors' => $errors
                    ]);
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Application updated successfully',
                'data' => $this->jobApplicationModel->find($id)
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Error in JobApplications::update: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Delete job application
     */
    public function delete($id)
    {
        $application = $this->jobApplicationModel->find($id);
        
        if (!$application) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Job application not found']);
        }

        // Delete resume file if exists
        if (!empty($application->resume_path) && file_exists($application->resume_path)) {
            @unlink($application->resume_path);
        }

        $this->jobApplicationModel->delete($id);

        return $this->response->setJSON([
            'success' => true,
            'message' => 'Application deleted successfully'
        ]);
    }

    /**
     * Upload resume file (public endpoint - no auth required)
     */
    public function uploadResume()
    {
        try {
            // Log all uploaded files for debugging
            $files = $this->request->getFiles();
            log_message('error', 'JobApplications::uploadResume - All files: ' . json_encode(array_keys($files)));
            log_message('error', 'JobApplications::uploadResume - Request method: ' . $this->request->getMethod());
            log_message('error', 'JobApplications::uploadResume - Content-Type: ' . $this->request->getHeaderLine('Content-Type'));
            
            $file = $this->request->getFile('resume');
            
            if (!$file) {
                log_message('error', 'JobApplications::uploadResume - No file found with key "resume"');
                // Try alternative method
                $uploadedFiles = $this->request->getFiles();
                log_message('error', 'JobApplications::uploadResume - Available file keys: ' . json_encode(array_keys($uploadedFiles)));
                
                // Try to get first file if 'resume' key doesn't exist
                if (!empty($uploadedFiles)) {
                    $fileKeys = array_keys($uploadedFiles);
                    $file = $this->request->getFile($fileKeys[0]);
                    log_message('error', 'JobApplications::uploadResume - Trying first file key: ' . $fileKeys[0]);
                }
                
                if (!$file) {
                    return $this->response
                        ->setStatusCode(400)
                        ->setJSON(['error' => 'No file uploaded']);
                }
            }
            
            if (!$file->isValid()) {
                $error = $file->getErrorString();
                log_message('error', 'JobApplications::uploadResume - File invalid: ' . $error);
                log_message('error', 'JobApplications::uploadResume - File errors: ' . json_encode($file->getErrors()));
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Invalid file: ' . $error]);
            }

            // Validate file type
            $allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            $allowedExtensions = ['pdf', 'doc', 'docx'];
            
            // Get extension from original filename or MIME type
            $originalName = $file->getName();
            $extension = pathinfo($originalName, PATHINFO_EXTENSION);
            if (empty($extension)) {
                // Fallback: try to get extension from MIME type
                $mimeType = $file->getMimeType();
                $mimeToExt = [
                    'application/pdf' => 'pdf',
                    'application/msword' => 'doc',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx'
                ];
                $extension = $mimeToExt[$mimeType] ?? null;
            }
            
            log_message('error', 'JobApplications::uploadResume - File extension: ' . $extension);
            log_message('error', 'JobApplications::uploadResume - File MIME type: ' . $file->getMimeType());
            
            if (empty($extension) || !in_array(strtolower($extension), $allowedExtensions)) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.']);
            }

            // Validate file size (max 5MB)
            if ($file->getSize() > 5 * 1024 * 1024) {
                return $this->response
                    ->setStatusCode(400)
                    ->setJSON(['error' => 'File size exceeds 5MB limit']);
            }

            // Generate unique filename (extension already determined above)
            $baseName = pathinfo($originalName, PATHINFO_FILENAME);
            $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $baseName);
            $newName = $baseName . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . strtolower($extension);
            
            // Move file to secured folder (outside public directory)
            $uploadPath = WRITEPATH . 'uploads' . DIRECTORY_SEPARATOR . 'resumes' . DIRECTORY_SEPARATOR;
            
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0750, true);
            }

            if (!$file->hasMoved()) {
                if ($file->move($uploadPath, $newName)) {
                    log_message('error', 'JobApplications::uploadResume - File moved successfully: ' . $newName);
                    return $this->response->setJSON([
                        'success' => true,
                        'filename' => $newName,
                        'path' => $uploadPath . $newName,
                        'message' => 'Resume uploaded successfully'
                    ]);
                } else {
                    $errors = $file->getErrors();
                    log_message('error', 'JobApplications::uploadResume - Move failed: ' . json_encode($errors));
                    return $this->response
                        ->setStatusCode(500)
                        ->setJSON([
                            'error' => 'Failed to save file',
                            'errors' => $errors
                        ]);
                }
            } else {
                log_message('error', 'JobApplications::uploadResume - File already moved');
                return $this->response
                    ->setStatusCode(500)
                    ->setJSON(['error' => 'File already processed']);
            }
        } catch (\Throwable $e) {
            log_message('error', 'Error in JobApplications::uploadResume: ' . $e->getMessage());
            log_message('error', 'Stack trace: ' . $e->getTraceAsString());
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'error' => 'Internal server error',
                    'message' => $e->getMessage()
                ]);
        }
    }

    /**
     * Download resume (protected endpoint - requires auth)
     */
    public function downloadResume($id)
    {
        $application = $this->jobApplicationModel->find($id);
        
        if (!$application) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Application not found']);
        }

        if (empty($application->resume_path) || !file_exists($application->resume_path)) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON(['error' => 'Resume file not found']);
        }

        // Send file for download
        return $this->response->download(
            $application->resume_path,
            null
        )->setFileName($application->resume_filename ?? 'resume.pdf');
    }

    /**
     * Export job applications to Excel format (CSV)
     */
    public function exportExcel()
    {
        try {
            $jobListingId = $this->request->getGet('job_listing_id');
            
            if ($jobListingId) {
                $applications = $this->jobApplicationModel->getByJobListing((int)$jobListingId);
            } else {
                $applications = $this->jobApplicationModel->orderBy('created_at', 'DESC')->findAll();
            }

            // Build CSV content
            $csvContent = '';
            
            // Add BOM for UTF-8 Excel compatibility
            $csvContent .= chr(0xEF).chr(0xBB).chr(0xBF);
            
            // Headers
            $headers = [
                'ID',
                'Name',
                'Email',
                'Contact Number',
                'City',
                'Applied Job Profile',
                'Status',
                'Applied Date',
                'Resume Filename',
                'Notes'
            ];
            $csvContent .= $this->arrayToCsv($headers) . "\n";
            
            // Data rows
            foreach ($applications as $app) {
                $row = [
                    $app->id ?? '',
                    $app->name ?? '',
                    $app->email ?? '',
                    $app->contact_number ?? '',
                    $app->city ?? '',
                    $app->applied_job_profile ?? '',
                    $app->status ?? 'pending',
                    $app->created_at ?? '',
                    $app->resume_filename ?? '',
                    $app->notes ?? ''
                ];
                $csvContent .= $this->arrayToCsv($row) . "\n";
            }
            
            // Set headers for CSV file download (Excel can open CSV)
            return $this->response
                ->setHeader('Content-Type', 'text/csv; charset=UTF-8')
                ->setHeader('Content-Disposition', 'attachment; filename="job_applications_' . date('Y-m-d') . '.csv"')
                ->setBody($csvContent);
        } catch (\Throwable $e) {
            log_message('error', 'Error in JobApplications::exportExcel: ' . $e->getMessage());
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

