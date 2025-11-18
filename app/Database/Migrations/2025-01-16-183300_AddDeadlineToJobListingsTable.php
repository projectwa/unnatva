<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddDeadlineToJobListingsTable extends Migration
{
    public function up()
    {
        $this->forge->addColumn('job_listings', [
            'deadline' => [
                'type' => 'DATE',
                'null' => true,
                'comment' => 'Last date of application. Job will not be visible after this date.',
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('job_listings', 'deadline');
    }
}

