<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddFieldsToEnquiriesTable extends Migration
{
    public function up()
    {
        $fields = [
            'company_name' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'name',
            ],
            'business_email' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'email',
            ],
            'areas_of_interest' => [
                'type' => 'JSON',
                'null' => true,
                'comment' => 'Array of selected areas: entrepreneurship, skill-development, women-empowerment, education',
                'after' => 'business_email',
            ],
        ];

        // Check if columns exist before adding
        $this->forge->addColumn('enquiries', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('enquiries', ['company_name', 'business_email', 'areas_of_interest']);
    }
}

