<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateMediaItemsTable extends Migration
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
            'filename' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'original_filename' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'file_path' => [
                'type'       => 'VARCHAR',
                'constraint' => '500',
            ],
            'file_type' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
                'comment'    => 'image, video, document',
            ],
            'mime_type' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
            ],
            'file_size' => [
                'type'       => 'BIGINT',
                'constraint' => 20,
                'unsigned'   => true,
                'comment'    => 'Size in bytes',
            ],
            'width' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
            ],
            'height' => [
                'type'       => 'INT',
                'constraint' => 11,
                'null'       => true,
            ],
            'alt_text' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'caption' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'category' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
                'comment'    => 'e.g., Practical Sessions, Community Based Skill Trainings',
            ],
            'tags' => [
                'type' => 'JSON',
                'null' => true,
            ],
            'uploaded_by' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
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
        $this->forge->addKey('file_type');
        $this->forge->addKey('category');
        $this->forge->addKey('uploaded_by');
        $this->forge->createTable('media_items');
    }

    public function down()
    {
        $this->forge->dropTable('media_items');
    }
}



