const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    // Your admin details
    const adminEmail = 'admin@trendimovies.xyz';
    const adminPassword = 'Admin@2025'; // Change this to your desired password
    const adminName = 'TrendiMovies Admin';

    console.log('Creating admin user...');

    // Hash the password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', adminEmail)
      .single();

    if (existing) {
      console.log('Admin user already exists, updating password...');

      // Update existing user
      const { error } = await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          role: 'admin',
          status: 'active',
          name: adminName,
        })
        .eq('email', adminEmail);

      if (error) {
        throw error;
      }

      console.log('✅ Admin user updated successfully!');
    } else {
      console.log('Creating new admin user...');

      // Create new user
      const { error } = await supabase
        .from('users')
        .insert({
          name: adminName,
          email: adminEmail,
          password_hash: passwordHash,
          role: 'admin',
          status: 'active',
        });

      if (error) {
        throw error;
      }

      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('\n⚠️  Please change this password after first login!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
