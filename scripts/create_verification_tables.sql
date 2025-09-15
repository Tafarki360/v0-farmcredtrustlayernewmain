-- Creating comprehensive database tables for verification system
-- Create verification logs table
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL,
    identifier VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('initiated', 'verified', 'failed', 'error')),
    response_data JSONB,
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cooperatives table
CREATE TABLE IF NOT EXISTS cooperatives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cooperative_id VARCHAR(50) UNIQUE NOT NULL,
    cooperative_name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    lga VARCHAR(100) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    cac_number VARCHAR(20) NOT NULL,
    established_year INTEGER NOT NULL,
    executive_committee JSONB NOT NULL,
    address TEXT NOT NULL,
    member_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cooperative members table
CREATE TABLE IF NOT EXISTS cooperative_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cooperative_id VARCHAR(50) NOT NULL REFERENCES cooperatives(cooperative_id),
    membership_id VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farm verification table
CREATE TABLE IF NOT EXISTS farm_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_location TEXT NOT NULL,
    farm_size VARCHAR(50),
    crop_type VARCHAR(100),
    coordinates JSONB,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verified_by UUID REFERENCES auth.users(id),
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent assignments table
CREATE TABLE IF NOT EXISTS agent_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES auth.users(id),
    farmer_id UUID NOT NULL REFERENCES auth.users(id),
    cooperative_id VARCHAR(50) REFERENCES cooperatives(cooperative_id),
    assignment_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security audit logs table
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_logs_user_id ON verification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_type ON verification_logs(verification_type);
CREATE INDEX IF NOT EXISTS idx_verification_logs_status ON verification_logs(status);
CREATE INDEX IF NOT EXISTS idx_cooperatives_location ON cooperatives(state, lga, ward);
CREATE INDEX IF NOT EXISTS idx_cooperative_members_email ON cooperative_members(email);
CREATE INDEX IF NOT EXISTS idx_farm_verifications_farmer ON farm_verifications(farmer_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_user ON security_audit_logs(user_id);

-- Enable Row Level Security
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperative_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Verification logs: Users can only see their own logs
CREATE POLICY "Users can view own verification logs" ON verification_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification logs" ON verification_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cooperatives: Public read, restricted write
CREATE POLICY "Anyone can view active cooperatives" ON cooperatives
    FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can create cooperatives" ON cooperatives
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Cooperative creators can update their cooperatives" ON cooperatives
    FOR UPDATE USING (auth.uid() = created_by);

-- Cooperative members: Members can see their own data
CREATE POLICY "Members can view own membership" ON cooperative_members
    FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "System can insert members" ON cooperative_members
    FOR INSERT WITH CHECK (true);

-- Farm verifications: Farmers can see their own, agents can see assigned
CREATE POLICY "Farmers can view own farm verifications" ON farm_verifications
    FOR SELECT USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can insert own farm verifications" ON farm_verifications
    FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Agents can update assigned verifications" ON farm_verifications
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT agent_id FROM agent_assignments 
            WHERE farmer_id = farm_verifications.farmer_id 
            AND status IN ('assigned', 'in_progress')
        )
    );

-- Agent assignments: Agents and farmers can see their assignments
CREATE POLICY "Users can view their assignments" ON agent_assignments
    FOR SELECT USING (auth.uid() = agent_id OR auth.uid() = farmer_id);

-- Security audit logs: Users can only see their own logs
CREATE POLICY "Users can view own audit logs" ON security_audit_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs" ON security_audit_logs
    FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, INSERT ON verification_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON cooperatives TO authenticated;
GRANT SELECT, INSERT ON cooperative_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON farm_verifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON agent_assignments TO authenticated;
GRANT SELECT, INSERT ON security_audit_logs TO authenticated;
