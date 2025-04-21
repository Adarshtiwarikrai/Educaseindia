
const { Pool } = require('pg');


const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:Bvk0KX3IxLlT@ep-young-violet-a5yinpzw-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },   
  idleTimeoutMillis: 0,                 
  connectionTimeoutMillis: 10000        
});
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    console.log("✅ Keep-alive ping sent to PostgreSQL");
  } catch (err) {
    console.error("⚠️ Keep-alive failed:", err.message);
  }
}, 10 * 60 * 1000); 

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      );
    `);
    console.log("✅ Table 'schools' is ready.");
  } catch (err) {
    console.error("❌ Error setting up DB:", err.message);
  }
})();

module.exports = { pool };
