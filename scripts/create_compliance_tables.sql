-- Creating international standards compliance tracking tables

-- Create compliance standards table
CREATE TABLE IF NOT EXISTS compliance_standards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    standard_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('financial', 'cooperative', 'general')),
    description TEXT,
    certification_body VARCHAR(255),
    requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organization compliance table
CREATE TABLE IF NOT EXISTS organization_compliance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL,
    organization_type VARCHAR(50) NOT NULL CHECK (organization_type IN ('cooperative', 'lender', 'farmer')),
    standard_id UUID NOT NULL REFERENCES compliance_standards(id) ON DELETE CASCADE,
    compliance_level INTEGER NOT NULL CHECK (compliance_level >= 0 AND compliance_level <= 100),
    status VARCHAR(50) NOT NULL CHECK (status IN ('compliant', 'partial', 'non_compliant', 'pending')),
    last_audit_date DATE,
    next_audit_date DATE,
    audit_report_url TEXT,
    documents JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, standard_id)
);

-- Create compliance audit history table
CREATE TABLE IF NOT EXISTS compliance_audit_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_compliance_id UUID NOT NULL REFERENCES organization_compliance(id) ON DELETE CASCADE,
    audit_date DATE NOT NULL,
    auditor_name VARCHAR(255),
    auditor_organization VARCHAR(255),
    previous_compliance_level INTEGER,
    new_compliance_level INTEGER NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    findings TEXT,
    recommendations TEXT,
    corrective_actions JSONB,
    audit_report_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance alerts table
CREATE TABLE IF NOT EXISTS compliance_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL,
    organization_type VARCHAR(50) NOT NULL,
    standard_id UUID NOT NULL REFERENCES compliance_standards(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('audit_due', 'compliance_drop', 'certification_expiry', 'regulatory_change')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    due_date DATE,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert standard compliance frameworks
INSERT INTO compliance_standards (standard_code, name, category, description, certification_body, requirements) VALUES
-- Financial Institution Standards
('BASEL_III', 'Basel III Capital Requirements', 'financial', 'International regulatory framework for banks addressing capital adequacy, stress testing, and market liquidity risk', 'Central Bank of Nigeria (CBN)', 
 '["Minimum Common Equity Tier 1 (CET1) ratio of 4.5%", "Minimum Tier 1 capital ratio of 6%", "Minimum total capital ratio of 8%", "Capital conservation buffer of 2.5%", "Liquidity Coverage Ratio (LCR) of 100%", "Net Stable Funding Ratio (NSFR) of 100%"]'),

('IFRS_9', 'IFRS 9 Financial Instruments', 'financial', 'International accounting standard for financial instruments classification, measurement, and impairment', 'Financial Reporting Council of Nigeria', 
 '["Expected Credit Loss (ECL) model implementation", "Financial asset classification and measurement", "Hedge accounting requirements", "Impairment methodology documentation", "Forward-looking information integration"]'),

('AML_CFT', 'Anti-Money Laundering & Counter-Terrorism Financing', 'financial', 'International standards for preventing money laundering and terrorism financing', 'Nigerian Financial Intelligence Unit (NFIU)', 
 '["Customer Due Diligence (CDD) procedures", "Enhanced Due Diligence (EDD) for high-risk customers", "Suspicious Transaction Reporting (STR)", "Record keeping and monitoring systems", "Staff training and awareness programs", "Risk assessment and management framework"]'),

-- Cooperative Standards
('ICA_PRINCIPLES', 'ICA Cooperative Principles', 'cooperative', 'International Cooperative Alliance principles for cooperative identity and values', 'International Cooperative Alliance', 
 '["Voluntary and Open Membership", "Democratic Member Control", "Member Economic Participation", "Autonomy and Independence", "Education, Training and Information", "Cooperation among Cooperatives", "Concern for Community"]'),

('ISO_26000', 'ISO 26000 Social Responsibility', 'cooperative', 'International standard providing guidance on social responsibility', 'International Organization for Standardization', 
 '["Organizational governance", "Human rights protection", "Labour practices compliance", "Environmental responsibility", "Fair operating practices", "Consumer issues management", "Community involvement and development"]'),

('FAIR_TRADE', 'Fair Trade Standards', 'cooperative', 'International fair trade standards for agricultural cooperatives', 'Fairtrade International', 
 '["Democratic organization and participation", "Economic development and empowerment", "Social development programs", "Environmental protection measures", "Premium utilization transparency", "Non-discrimination policies"]'),

('GLOBAL_GAP', 'GLOBALG.A.P. Certification', 'cooperative', 'Global standard for good agricultural practices', 'GLOBALG.A.P. c/o FoodPLUS GmbH', 
 '["Food safety management", "Environmental protection", "Worker health and safety", "Animal welfare standards", "Traceability systems", "Quality management systems"]'),

-- General Standards
('ISO_27001', 'ISO 27001 Information Security', 'general', 'International standard for information security management systems', 'International Organization for Standardization', 
 '["Information Security Management System (ISMS)", "Risk assessment and treatment", "Security controls implementation", "Incident management procedures", "Business continuity planning", "Regular security audits and reviews"]');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organization_compliance_org_id ON organization_compliance(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_compliance_standard_id ON organization_compliance(standard_id);
CREATE INDEX IF NOT EXISTS idx_organization_compliance_status ON organization_compliance(status);
CREATE INDEX IF NOT EXISTS idx_compliance_audit_history_org_compliance_id ON compliance_audit_history(organization_compliance_id);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_org_id ON compliance_alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_compliance_alerts_resolved ON compliance_alerts(is_resolved);

-- Enable Row Level Security
ALTER TABLE compliance_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_audit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Compliance standards are public
CREATE POLICY "Compliance standards are viewable by all authenticated users" ON compliance_standards
    FOR SELECT USING (auth.role() = 'authenticated');

-- Organizations can only see their own compliance data
CREATE POLICY "Organizations can view own compliance data" ON organization_compliance
    FOR SELECT USING (auth.uid()::text = organization_id::text);

CREATE POLICY "Organizations can update own compliance data" ON organization_compliance
    FOR UPDATE USING (auth.uid()::text = organization_id::text);

-- Service role can manage all compliance data
CREATE POLICY "Service role can manage all compliance data" ON organization_compliance
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Similar policies for audit history and alerts
CREATE POLICY "Organizations can view own audit history" ON compliance_audit_history
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM organization_compliance oc 
        WHERE oc.id = organization_compliance_id 
        AND oc.organization_id::text = auth.uid()::text
    ));

CREATE POLICY "Organizations can view own compliance alerts" ON compliance_alerts
    FOR SELECT USING (auth.uid()::text = organization_id::text);

-- Grant necessary permissions
GRANT SELECT ON compliance_standards TO authenticated;
GRANT SELECT, INSERT, UPDATE ON organization_compliance TO authenticated;
GRANT SELECT, INSERT ON compliance_audit_history TO authenticated;
GRANT SELECT, INSERT, UPDATE ON compliance_alerts TO authenticated;
