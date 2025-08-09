const db = require('../models/database');

const waitForDatabase = async (maxAttempts = 10) => {
  console.log('⏳ Waiting for database to be available...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await db.query('SELECT 1');
      console.log('✅ Database is ready!');
      return true;
    } catch (error) {
      console.log(`Database connection attempt ${attempt}/${maxAttempts} failed:`, error.message);
      
      if (attempt === maxAttempts) {
        console.error('❌ Database never became available');
        return false;
      }
      
      // Wait 5 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

const runMigrationIfNeeded = async () => {
  try {
    // Check if migrations have already been run by checking for users table
    const result = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `);
    
    if (result.rows[0].exists) {
      console.log('🔍 Tables already exist, skipping migration');
      return true;
    }
    
    console.log('🚀 Running database migration...');
    
    // Import and run migration functions directly
    const { createTables } = require('./migrate-functions');
    await createTables();
    
    return true;
  } catch (error) {
    console.error('❌ Migration check/run failed:', error.message);
    return false;
  }
};

const startup = async () => {
  console.log('🌟 HydrateMate Server Starting Up...');
  
  try {
    if (!process.env.DATABASE_URL) {
      console.log('⚠️  No DATABASE_URL found, starting in development mode');
      return { databaseReady: false, migrationComplete: false };
    }
    
    const databaseReady = await waitForDatabase();
    if (!databaseReady) {
      console.log('⚠️  Starting server without database');
      return { databaseReady: false, migrationComplete: false };
    }
    
    const migrationComplete = await runMigrationIfNeeded();
    
    return { databaseReady, migrationComplete };
  } catch (error) {
    console.error('🔥 Startup process failed:', error.message);
    console.log('⚠️  Starting server in fallback mode');
    return { databaseReady: false, migrationComplete: false };
  }
};

module.exports = startup;
