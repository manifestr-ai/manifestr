-- =============================================
-- ANALYZER CATALOG TABLE
-- Template catalog for chart/visualization generation
-- =============================================

CREATE TABLE IF NOT EXISTS analyzer_catalog (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(100) UNIQUE NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    chart_type VARCHAR(50) NOT NULL,
    description TEXT,
    use_cases TEXT,
    keywords TEXT[], -- Array of keywords for matching
    data_structure JSONB, -- Expected data structure
    config_template JSONB, -- Default chart configuration
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster searching
CREATE INDEX IF NOT EXISTS idx_analyzer_category ON analyzer_catalog(category);
CREATE INDEX IF NOT EXISTS idx_analyzer_chart_type ON analyzer_catalog(chart_type);
CREATE INDEX IF NOT EXISTS idx_analyzer_keywords ON analyzer_catalog USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_analyzer_active ON analyzer_catalog(is_active) WHERE is_active = true;

-- Add comment
COMMENT ON TABLE analyzer_catalog IS 'Catalog of chart/visualization templates for the Analyzer feature';
