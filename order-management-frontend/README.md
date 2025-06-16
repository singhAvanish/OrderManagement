# 🛒 Order Management System (Admin Panel)

A full-stack Order Management System built with **Next.js**, **Redux Toolkit**, **Node.js**, **MongoDB**, and **JWT authentication**. This admin panel allows authorized admins to manage customer orders — including viewing, updating, and deleting orders — with secure access and a responsive dashboard interface.

---
## Getting Started

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.




## 🔐 Admin Credentials (for Testing)

Use these credentials to log in at `/admin/login`:

```txt
Email: admin@example.com
Password: securePass123
```
Only users with the correct passkey can create a new admin account.


ADMIN_SIGNUP_KEY=AXSTECH
Set this in your .env file (backend):

🧪 Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/your-username/order-management.git
cd order-management
2️⃣ Install Dependencies

npm install
3️⃣ Create .env File
Create a .env file in the root of the backend and add:

Backend Port = 4000
MONGO_URI=mongodb+srv://avanish121299:Tyrmq36lcPlzBvT1@cluster0.ssdzk9a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=avi121299
ADMIN_SIGNUP_KEY=AXSTECH
4️⃣ Run the Application

npm run dev
Frontend is usually at http://localhost:3000
Backend runs on http://localhost:4000

