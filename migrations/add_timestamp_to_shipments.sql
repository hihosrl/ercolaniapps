-- ===========================================
-- Migration: Backfill shipments.created_at from pdf.creato
-- Safe to re-run (idempotent)
-- ===========================================

-- 0) Save and relax strict zero-date modes (SESSION only)
SET @old_sql_mode := @@SESSION.sql_mode;
SET SESSION sql_mode = REPLACE(REPLACE(@@SESSION.sql_mode, 'NO_ZERO_DATE', ''), 'NO_ZERO_IN_DATE', '');

-- 1) Add column if missing (start as NULLable for backfill)
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'shipments'
    AND COLUMN_NAME  = 'created_at'
);

SET @ddl := IF(@col_exists = 0,
  'ALTER TABLE `shipments` ADD COLUMN `created_at` TIMESTAMP NULL DEFAULT NULL',
  'SELECT "shipments.created_at already exists"'
);
PREPARE stmt FROM @ddl; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2) Backfill from earliest valid pdf.creato per shipment_id
--    Use a regex to only consider properly formatted datetimes, then parse.
UPDATE `shipments` s
JOIN (
  SELECT
    shipment_id,
    MIN(STR_TO_DATE(creato, '%Y-%m-%d %H:%i:%s')) AS first_creato
  FROM `pdf`
  WHERE creato REGEXP '^[12][0-9]{3}-[01][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]$'
  GROUP BY shipment_id
) p ON p.shipment_id = s.id
SET s.`created_at` = p.first_creato
WHERE s.`created_at` IS NULL OR s.`created_at` = '0000-00-00 00:00:00';

-- 3) For shipments still without a value (no pdf rows), set to NOW()
UPDATE `shipments`
SET `created_at` = NOW()
WHERE `created_at` IS NULL OR `created_at` = '0000-00-00 00:00:00';

-- 4) Enforce NOT NULL + default for future inserts
ALTER TABLE `shipments`
  MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 5) (Optional) Index for filtering/ordering by created_at
-- CREATE INDEX idx_shipments_created_at ON `shipments`(`created_at`);

-- 6) Restore SESSION sql_mode
SET SESSION sql_mode = @old_sql_mode;
