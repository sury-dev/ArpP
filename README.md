# 💸 Personal Finance Tracker

A full-stack web application that helps users track their income, expenses, and analyze their financial data with ease. Built using **React**, **Node.js**, **MySQL**, and **Redis**.

---

## 🚀 Features

- 🔐 User Authentication (Login/Register)
- 🔒 Role-Based Access (Admin/User)
- 📥 Add, Edit, Delete Transactions
- 📊 View All Transactions in Tabular Format
- 🔎 Filter by Type, Category, and Date Range
- 📈 Visual Analytics: Income, Expense, Net Balance
- ⚡ Redis Caching for Performance
- ✅ Protected Routes with JWT
- 🌐 Deployed on Render (or any hosting platform)

---

## 🧱 Tech Stack

### Frontend
- React.js (Vite)
- Axios
- React Router
- Plain CSS

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Redis (Cloud)

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/arpitarai67/Personal-finance-tracker.git
cd Personal-finance-tracker
2. Backend Setup

cd backend
npm install
Set up .env file:

env
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
REDIS_URL=your_redis_url
Start the backend server:
npm start
3. Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
🌐 Environment Variables
Variable	Description
PORT	Backend server port
JWT_SECRET	Secret key for JWT tokens
DB_*	MySQL database configuration
REDIS_URL	Redis connection string (cloud)

🧪 Features to Try
Register as a user and login

Add income/expense transactions

Edit and delete transactions

Filter by type, category, or date range

Visit analytics tab for visual summary

📌 TODO
 Add password reset functionality

 Export data to CSV

 Admin dashboard for user management

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first.

📄 License
This project is licensed under the MIT License.

💬 Connect with Me
GitHub: @arpitarai67

LinkedIn: Arpita Rai
---


