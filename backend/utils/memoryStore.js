const bcrypt = require('bcryptjs');

// Instant In-Memory Database Store for Zero-Wait Hackathon Demonstration
class MemoryStore {
  constructor() {
    this.users = [];
    this.requests = [];
    this.notifications = [];
    this.certificates = [];
    this.seeded = false;
  }

  async seed() {
    if (this.seeded) return;
    this.seeded = true;

    console.log('⚡ Initializing Instant In-Memory Governance Data Engine...');
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash('password123', salt);

    // Students are added dynamically on registration — no pre-seeded student accounts.

    // 2. Department Staff
    this.users.push({
      _id: 'usr_lib_01',
      name: 'Dr. R. Sharma',
      email: 'library@demo.com',
      password: hashPass,
      role: 'department',
      department: 'Library',
      employeeId: 'LIB-882',
    });

    this.users.push({
      _id: 'usr_hst_01',
      name: 'Warden V. Kumar',
      email: 'hostel@demo.com',
      password: hashPass,
      role: 'department',
      department: 'Hostels',
      employeeId: 'HST-401',
    });

    this.users.push({
      _id: 'usr_spt_01',
      name: 'Coach P. Singh',
      email: 'sports@demo.com',
      password: hashPass,
      role: 'department',
      department: 'Sports',
      employeeId: 'SPT-109',
    });

    this.users.push({
      _id: 'usr_acc_01',
      name: 'S. Mehta',
      email: 'accounts@demo.com',
      password: hashPass,
      role: 'department',
      department: 'Accounts',
      employeeId: 'ACC-554',
    });

    // 3. Admin
    this.users.push({
      _id: 'usr_adm_01',
      name: 'System Admin',
      email: 'admin@demo.com',
      password: hashPass,
      role: 'admin',
      employeeId: 'ADM-001',
    });

    // Requests and certificates are created dynamically as real students register and submit clearance.

    console.log('✅ Instant In-Memory Governance Data Engine Ready!');
  }
}

const memoryStore = new MemoryStore();
memoryStore.seed();

module.exports = memoryStore;
