<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEnquiryStatusHistoryTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'enquiry_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'old_status' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => true,
            ],
            'new_status' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'null'       => false,
            ],
            'changed_at' => [
                'type' => 'DATETIME',
                'null' => false,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('enquiry_id');
        $this->forge->addKey('changed_at');
        $this->forge->addForeignKey('enquiry_id', 'enquiries', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('enquiry_status_history');
    }

    public function down()
    {
        $this->forge->dropTable('enquiry_status_history');
    }
}

