const User = require('../models/User');

const seedData = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database already seeded with staff accounts.');
      return;
    }

    console.log('Seeding department staff accounts...');

    // Department Staff Accounts only — students register themselves
    await User.create({
      name: 'Dr. R. Sharma',
      email: 'library@demo.com',
      password: 'password123',
      role: 'department',
      department: 'Library',
      employeeId: 'LIB-882',
    });

    await User.create({
      name: 'Warden V. Kumar',
      email: 'hostel@demo.com',
      password: 'password123',
      role: 'department',
      department: 'Hostels',
      employeeId: 'HST-401',
    });

    await User.create({
      name: 'Coach P. Singh',
      email: 'sports@demo.com',
      password: 'password123',
      role: 'department',
      department: 'Sports',
      employeeId: 'SPT-109',
    });

    await User.create({
      name: 'S. Mehta',
      email: 'accounts@demo.com',
      password: 'password123',
      role: 'department',
      department: 'Accounts',
      employeeId: 'ACC-554',
    });

    // Admin Account
    await User.create({
      name: 'System Admin',
      email: 'admin@demo.com',
      password: 'password123',
      role: 'admin',
      employeeId: 'ADM-001',
    });

    console.log('Staff accounts seeded successfully! Students must register to use the system.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedData;
