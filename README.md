# ClearCampus – Automated No-Dues & Digital Clearance System 🚀

**ClearCampus** is a full-stack, role-based digital campus governance web application built for hackathons and institutional campus management. It digitizes student semester and graduation clearance across multiple departments (**Library**, **Hostels**, **Sports**, and **Accounts**) with instant digital verification IDs, real-time status updates, downloadable PDF certificates, QR code verification, and in-app notifications.

---

## 🌟 Key Features

1. **🔐 Multi-Role JWT Authentication & Role-Based Access Control**:
   - **Students**: Create clearance requests, track live department-wise approvals, view rejection reasons, receive notifications, and download signed No-Dues Certificates.
   - **Department Staff (Library, Hostels, Sports, Accounts)**: Review student queues, approve with unique verification IDs, reject with detailed reasons, and view processed history.
   - **College Admin**: Monitor college-wide telemetry, department clearance throughput percentages, all requests, and system users.

2. **⚡ Quick Hackathon Role Switcher Bar**:
   - Sticky bar at the top of the interface for instant 1-click switching between Student, Department Officers, and Admin accounts during live judge demonstrations.

3. **✍️ Digital Verification Engine**:
   - Every approval generates a unique verification record (e.g. `LIB-CLR-2026-000123`) containing approving officer name, employee ID, and timestamp.

4. **📄 Automatic No-Dues Certificate (PDF) & QR Verification**:
   - Automatically generated upon approval from all 4 departments.
   - Includes embedded QR Code linking to `/verify/:verificationId` for instant validity checks.

5. **🔔 Real-time In-app Notifications**:
   - Notifications trigger on every approval/rejection with unread badge counter.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Canvas Confetti.
- **Backend**: Node.js, Express.js, JWT, Mongoose, PDFKit, QRCode.
- **Database**: MongoDB (Integrated `mongodb-memory-server` with auto-seeding + optional external `MONGODB_URI` connection).

---

## 🔑 Pre-Seeded Hackathon Demo Accounts

All accounts use password: `password123`

| Role | Department | Email | Demo Credentials |
| :--- | :--- | :--- | :--- |
| **Student** | N/A | `student@demo.com` | Guru Sulochana (ID: 23CSE001) |
| **Department Staff** | Library | `library@demo.com` | Dr. R. Sharma (EmpID: LIB-882) |
| **Department Staff** | Hostels | `hostel@demo.com` | Warden V. Kumar (EmpID: HST-401) |
| **Department Staff** | Sports | `sports@demo.com` | Coach P. Singh (EmpID: SPT-109) |
| **Department Staff** | Accounts | `accounts@demo.com` | S. Mehta (EmpID: ACC-554) |
| **Admin** | Governance | `admin@demo.com` | System Admin (EmpID: ADM-001) |

---

## 🚀 Quick Start Instructions

### 1. Run Backend Server
```bash
cd backend
npm install
npm run dev
# Backend starts on http://localhost:5000
```

### 2. Run Frontend Application
```bash
cd frontend
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 🧪 Complete Demo Test Scenario

1. Log in as **Student** (`student@demo.com`).
2. Click **"Request No-Dues Clearance"** -> Confirm student details -> Submit.
3. Observe status: All 4 departments (Library, Hostels, Sports, Accounts) marked as **Pending (Yellow)**. Progress bar = **0%**.
4. Use the **Quick Demo Switcher** bar at the top to switch to **Library Staff** (`library@demo.com`). Click **Approve**.
5. Switch back to **Student**: Library status is now **Approved (Green)**. Progress bar = **25%**.
6. Switch to **Hostels**, **Sports**, and **Accounts** staff in turn and **Approve**.
7. Return to **Student Dashboard**: Overall status changes to **"All Departments Cleared ✓"** (100%).
8. Click **Download Certificate (PDF)** to view the generated document.
9. Click **QR Verification** or scan the certificate QR code to navigate to `/verify/NDC-2026-...` and see **"Certificate Valid ✓"**.
