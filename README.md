# 🚔 E-FIR (Electronic First Information Report System)

An intelligent, full-stack dual-portal web application for filing, managing, and tracking First Information Reports (FIRs) with AI-powered legal categorization, real-time OTP authentication, and evidence document management.

**Author**: [Prasad Jadhav](https://github.com/Prasadjadhav1731)  
**Repository**: [https://github.com/Prasadjadhav1731/E-FIR](https://github.com/Prasadjadhav1731/E-FIR)

---

## 🌟 Key Features

- 👮 **Dual-Portal System**:
  - **Citizen Portal**: Register, authenticate via OTP/password, file complaints with detailed victim/accused/witness info, upload evidence, and track live FIR statuses.
  - **Super User / Police Portal**: Multi-parameter search & filtering (Incident Date, Last Edited, District, Sub-District, Legal Categories, Aadhaar, Status, Officer ID), review AI complaint summaries, view uploaded evidence, and record official remarks (`Completed` or `Park`).
- 🤖 **AI-Powered Legal Assistant**:
  - Automatically generates concise FIR summaries and identifies relevant IPC/legal categories using **Google Gemini AI**.
- ☁️ **Resilient Evidence Storage**:
  - Integrated Cloudinary storage for uploaded evidence files with fallback options.
- 🔐 **Secure Authentication & Real-Time Sync**:
  - Bcrypt password hashing, JWT token authentication, numeric OTP email verification, and **Socket.io** real-time updates.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Framer Motion, Axios, React Hot Toast, Socket.io-client
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose ODM), Socket.io, Cookie Parser, Express FileUpload
- **Services & AI**: Google Generative AI (`gemini-2.5-flash`), Cloudinary SDK, Nodemailer

---

## 📁 Repository Structure

```text
E-FIR/
├── backend/                  # Node.js & Express API Server
│   ├── config/               # Database & Cloudinary config
│   ├── controller/           # Complaint, User & Police controllers
│   ├── middleware/           # Auth & file upload middlewares
│   ├── models/               # Mongoose schemas (User, Complaint, etc.)
│   ├── routes/               # API endpoints
│   ├── utils/                # AI & Mailer helpers
│   └── index.js              # Server entry point
├── frontend/                 # React SPA Client
│   ├── public/               # Static web assets
│   └── src/
│       ├── components/       # UI Components (Dashboards, Filter, Anonymous, etc.)
│       ├── config/           # API & Socket configuration
│       └── App.js            # Main application router
├── .gitignore                # Production git ignore configuration
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas database cluster
- Google Gemini API key

---

### 📥 Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Prasadjadhav1731/E-FIR.git
   cd E-FIR
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file inside `backend/`:
   ```env
   PORT=5000
   URL=your_mongodb_connection_string
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   API_KEY_GEN_AI=your_gemini_api_key
   JWT_SECRET=your_jwt_secret
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_email_app_password
   FRONTEND_URL=http://localhost:3000
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file inside `frontend/`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api/v1
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

---

## ⚡ Running the Application

1. **Start Backend Server**:
   ```bash
   cd backend
   node index.js
   ```
   *(Server starts on `http://localhost:5000`)*

2. **Start Frontend Application**:
   ```bash
   cd frontend
   npm start
   ```
   *(App runs on `http://localhost:3000`)*

---

## 📄 License

Distributed under the MIT License. Created by [Prasad Jadhav](https://github.com/Prasadjadhav1731).

