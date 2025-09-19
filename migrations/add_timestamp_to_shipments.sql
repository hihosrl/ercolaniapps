-- Migration: Add timestamp column to shipments table
-- This adds a created_at timestamp column to track when shipments are created
-- Run this migration to update the existing shipments table structure

ALTER TABLE `shipments` 
ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have a timestamp (optional)
-- This sets all existing records to the current timestamp
-- You may want to modify this based on your needs
UPDATE `shipments` 
SET `created_at` = CURRENT_TIMESTAMP 
WHERE `created_at` IS NULL OR `created_at` = '0000-00-00 00:00:00';
