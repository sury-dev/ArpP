const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { findUserByEmail, createUser } = require('../models/userModel');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: 'Name, email, and password are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Please provide a valid email address' 
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }

  // Set default role if not provided
  const userRole = role || 'user';

  const existingUser = await findUserByEmail(email);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await createUser(name, email, hashedPassword, userRole);
  res.status(201).json({ message: 'User registered successfully', userId });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

module.exports = { register, login };
