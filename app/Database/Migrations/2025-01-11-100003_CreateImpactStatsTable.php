<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateImpactStatsTable extends Migration
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
            'value' => [
                'type'       => 'VARCHAR',
                'constraint' => '50',
            ],
            'suffix' => [
                'type'       => 'VARCHAR',
                'constraint' => '10',
                'null'       => true,
                'comment'    => 'e.g., +, %, Cr.',
            ],
            'text' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'bg' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'comment'    => 'Background image filename',
            ],
            'is_active' => [
                'type'       => 'TINYINT',
                'constraint' => 1,
                'default'    => 1,
            ],
            'sort_order' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
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
        $this->forge->addKey('is_active');
        $this->forge->addKey('sort_order');
        $this->forge->createTable('impact_stats');
    }

    public function down()
    {
        $this->forge->dropTable('impact_stats');
    }
}



