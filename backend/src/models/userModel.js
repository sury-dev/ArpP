const db = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const createUser = async (name, email, hashedPassword, role = 'user') => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );
  return result.insertId;
};

module.exports = {
  findUserByEmail,
  createUser,
};
