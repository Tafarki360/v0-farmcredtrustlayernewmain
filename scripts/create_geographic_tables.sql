-- Creating geographic organization tables for enhanced location management
-- Create states table
CREATE TABLE IF NOT EXISTS states (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    zone VARCHAR(50) NOT NULL,
    capital VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create local government areas table
CREATE TABLE IF NOT EXISTS local_government_areas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    headquarters VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, state_id)
);

-- Create wards table
CREATE TABLE IF NOT EXISTS wards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lga_id UUID NOT NULL REFERENCES local_government_areas(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, lga_id)
);

-- Create enhanced cooperatives table with geographic references
CREATE TABLE IF NOT EXISTS cooperatives_enhanced (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cooperative_id VARCHAR(50) UNIQUE NOT NULL,
    cooperative_name VARCHAR(255) NOT NULL,
    state_id UUID NOT NULL REFERENCES states(id),
    lga_id UUID NOT NULL REFERENCES local_government_areas(id),
    ward_id UUID NOT NULL REFERENCES wards(id),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    cac_number VARCHAR(20) NOT NULL,
    established_year INTEGER NOT NULL,
    executive_committee JSONB NOT NULL,
    address TEXT NOT NULL,
    coordinates JSONB, -- Store lat/lng coordinates
    member_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create geographic statistics view
CREATE OR REPLACE VIEW geographic_statistics AS
SELECT 
    s.name as state_name,
    s.code as state_code,
    COUNT(DISTINCT lga.id) as total_lgas,
    COUNT(DISTINCT w.id) as total_wards,
    COUNT(DISTINCT c.id) as total_cooperatives,
    COALESCE(SUM(c.member_count), 0) as total_members,
    COUNT(CASE WHEN c.status = 'active' THEN 1 END) as active_cooperatives,
    COUNT(CASE WHEN c.verification_status = 'verified' THEN 1 END) as verified_cooperatives
FROM states s
LEFT JOIN local_government_areas lga ON s.id = lga.state_id
LEFT JOIN wards w ON lga.id = w.lga_id
LEFT JOIN cooperatives_enhanced c ON w.id = c.ward_id
GROUP BY s.id, s.name, s.code
ORDER BY s.name;

-- Insert Nigerian states data
INSERT INTO states (name, code, zone, capital) VALUES
('Abia', 'AB', 'South East', 'Umuahia'),
('Adamawa', 'AD', 'North East', 'Yola'),
('Akwa Ibom', 'AK', 'South South', 'Uyo'),
('Anambra', 'AN', 'South East', 'Awka'),
('Bauchi', 'BA', 'North East', 'Bauchi'),
('Bayelsa', 'BY', 'South South', 'Yenagoa'),
('Benue', 'BN', 'North Central', 'Makurdi'),
('Borno', 'BO', 'North East', 'Maiduguri'),
('Cross River', 'CR', 'South South', 'Calabar'),
('Delta', 'DT', 'South South', 'Asaba'),
('Ebonyi', 'EB', 'South East', 'Abakaliki'),
('Edo', 'ED', 'South South', 'Benin City'),
('Ekiti', 'EK', 'South West', 'Ado-Ekiti'),
('Enugu', 'EN', 'South East', 'Enugu'),
('FCT', 'FC', 'North Central', 'Abuja'),
('Gombe', 'GO', 'North East', 'Gombe'),
('Imo', 'IM', 'South East', 'Owerri'),
('Jigawa', 'JI', 'North West', 'Dutse'),
('Kaduna', 'KD', 'North West', 'Kaduna'),
('Kano', 'KN', 'North West', 'Kano'),
('Katsina', 'KT', 'North West', 'Katsina'),
('Kebbi', 'KB', 'North West', 'Birnin Kebbi'),
('Kogi', 'KG', 'North Central', 'Lokoja'),
('Kwara', 'KW', 'North Central', 'Ilorin'),
('Lagos', 'LA', 'South West', 'Ikeja'),
('Nasarawa', 'NA', 'North Central', 'Lafia'),
('Niger', 'NI', 'North Central', 'Minna'),
('Ogun', 'OG', 'South West', 'Abeokuta'),
('Ondo', 'ON', 'South West', 'Akure'),
('Osun', 'OS', 'South West', 'Osogbo'),
('Oyo', 'OY', 'South West', 'Ibadan'),
('Plateau', 'PL', 'North Central', 'Jos'),
('Rivers', 'RI', 'South South', 'Port Harcourt'),
('Sokoto', 'SO', 'North West', 'Sokoto'),
('Taraba', 'TA', 'North East', 'Jalingo'),
('Yobe', 'YO', 'North East', 'Damaturu'),
('Zamfara', 'ZA', 'North West', 'Gusau')
ON CONFLICT (name) DO NOTHING;

-- Sample LGAs for Katsina State (add more as needed)
INSERT INTO local_government_areas (name, state_id, code, headquarters)
SELECT 'Funtua', s.id, 'FUN', 'Funtua'
FROM states s WHERE s.name = 'Katsina'
ON CONFLICT (name, state_id) DO NOTHING;

INSERT INTO local_government_areas (name, state_id, code, headquarters)
SELECT 'Katsina', s.id, 'KAT', 'Katsina'
FROM states s WHERE s.name = 'Katsina'
ON CONFLICT (name, state_id) DO NOTHING;

INSERT INTO local_government_areas (name, state_id, code, headquarters)
SELECT 'Daura', s.id, 'DAU', 'Daura'
FROM states s WHERE s.name = 'Katsina'
ON CONFLICT (name, state_id) DO NOTHING;

-- Sample Wards for Funtua LGA
INSERT INTO wards (name, lga_id, code)
SELECT 'Central Ward', lga.id, 'CEN'
FROM local_government_areas lga 
JOIN states s ON lga.state_id = s.id
WHERE lga.name = 'Funtua' AND s.name = 'Katsina'
ON CONFLICT (name, lga_id) DO NOTHING;

INSERT INTO wards (name, lga_id, code)
SELECT 'Funtua Ward A', lga.id, 'FWA'
FROM local_government_areas lga 
JOIN states s ON lga.state_id = s.id
WHERE lga.name = 'Funtua' AND s.name = 'Katsina'
ON CONFLICT (name, lga_id) DO NOTHING;

INSERT INTO wards (name, lga_id, code)
SELECT 'Funtua Ward B', lga.id, 'FWB'
FROM local_government_areas lga 
JOIN states s ON lga.state_id = s.id
WHERE lga.name = 'Funtua' AND s.name = 'Katsina'
ON CONFLICT (name, lga_id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lga_state ON local_government_areas(state_id);
CREATE INDEX IF NOT EXISTS idx_ward_lga ON wards(lga_id);
CREATE INDEX IF NOT EXISTS idx_cooperative_location ON cooperatives_enhanced(state_id, lga_id, ward_id);
CREATE INDEX IF NOT EXISTS idx_cooperative_status ON cooperatives_enhanced(status, verification_status);

-- Enable Row Level Security
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_government_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperatives_enhanced ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public read access for geographic data)
CREATE POLICY "Public read access to states" ON states FOR SELECT USING (true);
CREATE POLICY "Public read access to LGAs" ON local_government_areas FOR SELECT USING (true);
CREATE POLICY "Public read access to wards" ON wards FOR SELECT USING (true);

-- Cooperative policies
CREATE POLICY "Public read access to active cooperatives" ON cooperatives_enhanced
    FOR SELECT USING (status = 'active' AND verification_status = 'verified');

CREATE POLICY "Authenticated users can create cooperatives" ON cooperatives_enhanced
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Cooperative creators can update their cooperatives" ON cooperatives_enhanced
    FOR UPDATE USING (auth.uid() = created_by);

-- Grant permissions
GRANT SELECT ON states TO authenticated, anon;
GRANT SELECT ON local_government_areas TO authenticated, anon;
GRANT SELECT ON wards TO authenticated, anon;
GRANT SELECT ON geographic_statistics TO authenticated, anon;
GRANT SELECT, INSERT, UPDATE ON cooperatives_enhanced TO authenticated;
