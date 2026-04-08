-- Add brand_name column to style_guides table
ALTER TABLE style_guides
ADD COLUMN IF NOT EXISTS brand_name VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_style_guides_brand_name ON style_guides(brand_name);
