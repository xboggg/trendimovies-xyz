-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on role for admin queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (name, email, password_hash, role, status)
VALUES (
  'Admin User',
  'admin@trendimovies.xyz',
  '$2a$10$YourBcryptHashHere',
  'admin',
  'active'
)
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE users IS 'User accounts for TrendiMovies admin and authentication';
COMMENT ON COLUMN users.role IS 'User role: user (regular), editor (can manage content), admin (full access)';
COMMENT ON COLUMN users.status IS 'Account status: active, inactive, or suspended';
