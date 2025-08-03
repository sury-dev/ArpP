const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function initializeDatabase() {
  let connection;
  
  try {
    // Create connection without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database '${process.env.DB_NAME}' created or already exists`);

    // Use the database
    await connection.execute(`USE ${process.env.DB_NAME}`);

    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }

    console.log('Database schema initialized successfully');
    
    // Create a default admin user if no users exist
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@financetracker.com', hashedPassword, 'admin']
      );
      
      console.log('Default admin user created:');
      console.log('Email: admin@financetracker.com');
      console.log('Password: admin123');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the initialization
initializeDatabase(); 