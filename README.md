# BuildERP – Construction ERP System

A full-stack ERP application for managing **projects, finance, users, risks, invoices, vendors, customers, payments, and analytics**.

https://github.com/user-attachments/assets/1d116b64-34d3-42c1-bfa1-8b4204ef13d2
---

## 🧱 Tech Stack
- **Frontend:** React, Vite, Styled-Components, React Query  
- **Backend:** Node.js, Express, MySQL, JWT (HttpOnly Cookies)  
- **Database:** MySQL  
- **Deployment:** Render (Backend), Vercel/Netlify (Frontend)

---

## 📁 Project Structure
```
repo/
│
├── client/        # React Frontend
│   └── src/
│
└── server/        # Node Backend
    └── routes/
        └── controllers/
```

---

## 🚀 Backend Setup
```
cd server
npm install
```

Create `.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=erpdb
JWT_SECRET=your_secret_key
```

Start backend:
```
npm start
```

---

## 💻 Frontend Setup
```
cd client
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:5000
```

Start frontend:
```
npm run dev
```

---

## 🔐 Authentication Rules
- Uses **secure HttpOnly cookies**
- Auto-login using `/auth/me`
- All internal routes are **Protected**
- Users **cannot access Dashboard or internal pages without login**
- Users **cannot go back to Landing/Login/Register** after they are authenticated
- Logout clears cookie + redirects to landing

---

## 🌐 Deployment Configuration

### Render (Backend)
```
Root Directory: server
Build Command: npm install
Start Command: npm start
Environment:
  PORT=5000
  JWT_SECRET=your_secret
  DB credentials...
```

### Vercel / Netlify (Frontend)
```
Root Directory: client
Build Command: npm run build
Output Directory: dist
Environment:
  VITE_API_URL=https://your-render-backend-url
```

---

## 📌 Main Features
- Project Management  
- Invoice & Payment Tracking  
- Customer & Vendor Management  
- Exchange Rates Module  
- General Ledger  
- User Management  
- Audit Logs  
- AI Insights (Risk / Health)  
- Dashboard Analytics  

---

## 👨‍💻 Developer
**Naveen Reddy Tippasani**  
Full Stack Developer

---
