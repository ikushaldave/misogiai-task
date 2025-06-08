/*
  # Add missing columns to case_studies table

  1. Changes
    - Add client column to case_studies table
    - Add industry column to case_studies table
    - Add images column as JSONB array for media items
  
  2. Security
    - No changes to RLS policies needed
*/

-- Add missing columns to case_studies table
DO $$
BEGIN
  -- Add client column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'client'
  ) THEN
    ALTER TABLE case_studies ADD COLUMN client TEXT;
  END IF;

  -- Add industry column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'industry'
  ) THEN
    ALTER TABLE case_studies ADD COLUMN industry TEXT;
  END IF;

  -- Update images column to be JSONB if it's currently TEXT[]
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' 
    AND column_name = 'images' 
    AND data_type = 'ARRAY'
  ) THEN
    -- First, convert existing TEXT[] data to JSONB format
    UPDATE case_studies 
    SET images = (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', generate_random_uuid()::text,
          'type', 'image',
          'url', unnest_val,
          'caption', ''
        )
      )
      FROM unnest(images) AS unnest_val
    )
    WHERE images IS NOT NULL AND array_length(images, 1) > 0;

    -- Drop the old column and recreate as JSONB
    ALTER TABLE case_studies DROP COLUMN images;
    ALTER TABLE case_studies ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- If images column doesn't exist at all, create it as JSONB
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'images'
  ) THEN
    ALTER TABLE case_studies ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;