const db = require('../models/database');

const createTables = async () => {
  console.log('📊 Creating database tables...');
  
  // Enable UUID extension
  await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  
  // Users table with enhanced fields for production
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE,
      password_hash VARCHAR(255),
      weight DECIMAL(5,2) NOT NULL,
      weight_unit VARCHAR(3) DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
      daily_goal INTEGER NOT NULL CHECK (daily_goal > 0),
      reminder_start TIME DEFAULT '08:00',
      reminder_end TIME DEFAULT '22:00',
      timezone VARCHAR(50) DEFAULT 'UTC',
      is_active BOOLEAN DEFAULT true,
      email_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Hydration logs table with partitioning support
  await db.query(`
    CREATE TABLE IF NOT EXISTS hydration_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL CHECK (amount > 0 AND amount <= 5000),
      source VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual', 'reminder', 'auto')),
      logged_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Challenges table for gamification
  await db.query(`
    CREATE TABLE IF NOT EXISTS challenges (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
      target_value INTEGER NOT NULL,
      reward_xp INTEGER DEFAULT 0,
      badge_icon VARCHAR(10),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // User challenges (many-to-many relationship)
  await db.query(`
    CREATE TABLE IF NOT EXISTS user_challenges (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
      progress INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT false,
      completed_at TIMESTAMP,
      started_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, challenge_id)
    )
  `);

  // Achievements table
  await db.query(`
    CREATE TABLE IF NOT EXISTS achievements (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      achievement_type VARCHAR(50) NOT NULL,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      icon VARCHAR(10),
      rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
      earned_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Notifications/reminders tracking
  await db.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) DEFAULT 'hydration_reminder',
      title VARCHAR(100),
      message TEXT,
      sent_at TIMESTAMP DEFAULT NOW(),
      responded BOOLEAN DEFAULT false,
      response_action VARCHAR(50)
    )
  `);

  // User sessions for auth
  await db.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      refresh_token VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      last_used TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log('📊 Creating performance indexes...');

  // Performance indexes
  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
    `CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid)`,
    `CREATE INDEX IF NOT EXISTS idx_hydration_user_date ON hydration_logs(user_id, DATE(logged_at))`,
    `CREATE INDEX IF NOT EXISTS idx_hydration_logged_at ON hydration_logs(logged_at)`,
    `CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_user_sent ON notifications(user_id, sent_at)`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(refresh_token)`
  ];

  for (const indexQuery of indexes) {
    await db.query(indexQuery);
  }

  console.log('🎮 Inserting default challenges...');

  // Insert default challenges
  await db.query(`
    INSERT INTO challenges (name, description, type, target_value, reward_xp, badge_icon) VALUES
    ('Morning Boost', 'Drink 500ml before 10 AM', 'daily', 500, 25, '🌅'),
    ('Steady Sipper', 'Log water 6 times throughout the day', 'daily', 6, 35, '⏰'),
    ('Hydration Hero', 'Exceed daily goal by 20%', 'daily', 120, 50, '🦸'),
    ('Perfect Week', 'Meet daily goal 7 days in a row', 'weekly', 7, 200, '🔥'),
    ('Weekly Warrior', 'Drink 15L total this week', 'weekly', 15000, 150, '⚔️')
    ON CONFLICT DO NOTHING
  `);

  console.log('✅ Database tables and indexes created successfully!');
  
  // Insert sample data for development only
  if (process.env.NODE_ENV !== 'production') {
    console.log('🌱 Inserting development sample data...');
    
    const sampleUser = await db.query(`
      INSERT INTO users (email, weight, weight_unit, daily_goal, reminder_start, reminder_end)
      VALUES ('demo@hydratemate.com', 70, 'kg', 2000, '08:00', '22:00')
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `);

    if (sampleUser.rows.length > 0) {
      const userId = sampleUser.rows[0].id;
      
      // Add sample hydration logs for the past week
      const dates = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      for (const date of dates) {
        await db.query(`
          INSERT INTO hydration_logs (user_id, amount, logged_at, source) VALUES
          ($1, 250, $2 || ' 08:30:00', 'manual'),
          ($1, 500, $2 || ' 11:15:00', 'reminder'),
          ($1, 300, $2 || ' 14:20:00', 'manual'),
          ($1, 400, $2 || ' 17:45:00', 'manual')
          ON CONFLICT DO NOTHING
        `, [userId, date]);
      }

      // Add sample achievement
      await db.query(`
        INSERT INTO achievements (user_id, achievement_type, title, description, icon, rarity)
        VALUES ($1, 'first_week', 'Getting Started', 'Completed your first week!', '🌟', 'common')
        ON CONFLICT DO NOTHING
      `, [userId]);

      console.log('✅ Development sample data inserted!');
    }
  }
  
  console.log('🎉 Database migration completed successfully!');
};

module.exports = { createTables };
