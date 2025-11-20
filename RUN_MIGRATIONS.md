# Database Migrations for Enquiries Follow-up System

## Required Migrations

To enable the follow-up and status history features, you need to run the following database migrations:

1. `2025-11-19-100000_CreateEnquiryFollowUpsTable.php`
2. `2025-11-19-100001_CreateEnquiryStatusHistoryTable.php`

## How to Run Migrations

### Option 1: Using CodeIgniter CLI (Recommended)

```bash
php spark migrate
```

This will run all pending migrations.

### Option 2: Using phpMyAdmin or Database Tool

Run the SQL commands manually:

#### Create Follow-ups Table:
```sql
CREATE TABLE `enquiry_follow_ups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `enquiry_id` int(11) unsigned NOT NULL,
  `follow_up_text` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `enquiry_id` (`enquiry_id`),
  KEY `created_at` (`created_at`),
  CONSTRAINT `enquiry_follow_ups_enquiry_id_foreign` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### Create Status History Table:
```sql
CREATE TABLE `enquiry_status_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `enquiry_id` int(11) unsigned NOT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) NOT NULL,
  `changed_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `enquiry_id` (`enquiry_id`),
  KEY `changed_at` (`changed_at`),
  CONSTRAINT `enquiry_status_history_enquiry_id_foreign` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Verification

After running migrations, verify the tables exist:
- `enquiry_follow_ups`
- `enquiry_status_history`

## Note

The code has been updated to gracefully handle missing tables (returns empty arrays), but full functionality requires these tables to exist.

