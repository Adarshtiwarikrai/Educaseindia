const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:Bvk0KX3IxLlT@ep-young-violet-a5yinpzw-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }  // 🧠 Required by Neon for SSL
});

client.connect()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully!");
    return client.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id serial PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      )
    `);
  })
  .then(() => {
    console.log("✅ 'schools' table is ready.");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection or query error:", err.message || err);
  });

module.exports = { client };
