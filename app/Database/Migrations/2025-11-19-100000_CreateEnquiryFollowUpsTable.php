<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEnquiryFollowUpsTable extends Migration
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
            'follow_up_text' => [
                'type' => 'TEXT',
                'null' => false,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id', true);
        $this->forge->addKey('enquiry_id');
        $this->forge->addKey('created_at');
        $this->forge->addForeignKey('enquiry_id', 'enquiries', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('enquiry_follow_ups');
    }

    public function down()
    {
        $this->forge->dropTable('enquiry_follow_ups');
    }
}

