-- Creating session management and logout tracking tables
-- Create user sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    logout_reason VARCHAR(100),
    logout_timestamp TIMESTAMP WITH TIME ZONE
);

-- Create logout events table for comprehensive logout tracking
CREATE TABLE IF NOT EXISTS logout_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    logout_type VARCHAR(50) NOT NULL CHECK (logout_type IN ('user_initiated', 'session_timeout', 'security_logout', 'admin_logout', 'global_logout')),
    user_type VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to automatically expire sessions
CREATE OR REPLACE FUNCTION expire_old_sessions()
RETURNS void AS $$
BEGIN
    UPDATE user_sessions 
    SET 
        is_active = false,
        logout_reason = 'session_timeout',
        logout_timestamp = NOW()
    WHERE 
        expires_at < NOW() 
        AND is_active = true;
        
    -- Log expired sessions
    INSERT INTO logout_events (user_id, session_id, logout_type, user_type, success, metadata, timestamp)
    SELECT 
        user_id,
        id,
        'session_timeout',
        user_type,
        true,
        jsonb_build_object('auto_expired', true, 'expired_at', expires_at),
        NOW()
    FROM user_sessions 
    WHERE 
        logout_reason = 'session_timeout' 
        AND logout_timestamp >= NOW() - INTERVAL '1 minute';
END;
$$ LANGUAGE plpgsql;

-- Create function to invalidate all user sessions (for security incidents)
CREATE OR REPLACE FUNCTION invalidate_all_user_sessions(target_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_sessions 
    SET 
        is_active = false,
        logout_reason = 'security_logout',
        logout_timestamp = NOW()
    WHERE 
        user_id = target_user_id 
        AND is_active = true;
        
    -- Log security logout
    INSERT INTO logout_events (user_id, logout_type, user_type, success, metadata, timestamp)
    SELECT 
        user_id,
        'security_logout',
        user_type,
        true,
        jsonb_build_object('reason', 'security_incident', 'all_sessions_invalidated', true),
        NOW()
    FROM user_sessions 
    WHERE 
        user_id = target_user_id 
        AND logout_reason = 'security_logout' 
        AND logout_timestamp >= NOW() - INTERVAL '1 minute'
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_logout_events_user_id ON logout_events(user_id);
CREATE INDEX IF NOT EXISTS idx_logout_events_timestamp ON logout_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_logout_events_type ON logout_events(logout_type);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE logout_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own logout events
CREATE POLICY "Users can view own logout events" ON logout_events
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all sessions
CREATE POLICY "Service role can manage all sessions" ON user_sessions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Service role can manage all logout events
CREATE POLICY "Service role can manage all logout events" ON logout_events
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a scheduled job to clean up expired sessions (runs every hour)
SELECT cron.schedule('cleanup-expired-sessions', '0 * * * *', 'SELECT expire_old_sessions();');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_sessions TO authenticated;
GRANT SELECT, INSERT ON logout_events TO authenticated;
GRANT EXECUTE ON FUNCTION expire_old_sessions() TO authenticated;
GRANT EXECUTE ON FUNCTION invalidate_all_user_sessions(UUID) TO authenticated;
