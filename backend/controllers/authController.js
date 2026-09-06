const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// @desc Auth user & get token
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email ? email.toLowerCase().trim() : '';

  try {
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: cleanEmail });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          studentId: user.studentId,
          employeeId: user.employeeId,
          course: user.course,
          academicYear: user.academicYear,
          token: generateToken(user._id),
        });
      }
    } else {
      // In-Memory Fallback
      await memoryStore.seed();
      user = memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          studentId: user.studentId,
          employeeId: user.employeeId,
          course: user.course,
          academicYear: user.academicYear,
          token: generateToken(user._id),
        });
      }
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Register new student
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, studentId, course, academicYear } = req.body;
  const cleanEmail = email ? email.toLowerCase().trim() : '';

  try {
    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        role: 'student',
        studentId: studentId || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
        course: course || 'B.Tech Computer Science',
        academicYear: academicYear || '2026',
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        course: user.course,
        academicYear: user.academicYear,
        token: generateToken(user._id),
      });
    } else {
      await memoryStore.seed();
      const userExists = memoryStore.users.find((u) => u.email === cleanEmail);
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: cleanEmail,
        password: hashPassword,
        role: 'student',
        studentId: studentId || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
        course: course || 'B.Tech Computer Science',
        academicYear: academicYear || '2026',
      };

      memoryStore.users.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId,
        course: newUser.course,
        academicYear: newUser.academicYear,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json(user);
    } else {
      await memoryStore.seed();
      const user = memoryStore.users.find((u) => u._id.toString() === req.user._id.toString());
      if (user) {
        const { password, ...userWithoutPass } = user;
        return res.json(userWithoutPass);
      }
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginUser, registerUser, getMe };
