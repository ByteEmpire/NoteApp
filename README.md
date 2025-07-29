# 📒 NoteApp

A secure and feature-rich **Note Taking Application** built with **MERN Stack** (MongoDB, Express, React, Node.js).  
It allows users to **sign up / sign in via OTP**, create and manage notes, share them via email, download as PDF, and keep data stored in MongoDB.

---

## 🚀 Features
- **OTP-based Authentication** – Sign up and sign in using email and One Time Password.
- **Create Notes** – Quickly create and save personal notes in MongoDB.
- **View All Notes** – Display your saved notes in a clean dashboard.
- **Download Notes as PDF** – Export your notes as PDF using jsPDF.
- **Share Notes via Email** – Send notes to anyone using FormSubmit.
- **Delete Notes** – Remove notes you no longer need.
- **Responsive Design** – Works on both desktop and mobile.
- **JWT Authentication** – All note routes are protected with JWT.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, CSS, jsPDF, React Icons  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** OTP via Resend API, JWT  
- **Email Service:** FormSubmit / Resend API
- **Version Control:** Git


---

## ⚙️ Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/ByteEmpire/NoteApp.git
cd NoteApp

# 2️⃣ Backend setup
cd backend
npm install

# Create .env file in backend/
echo "PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RESEND_API_KEY=your_resend_api_key" > .env

# Start backend server
npm start

# 3️⃣ Frontend setup
cd ../frontend
npm install

# Start frontend server
npm start

# 4️⃣ Open in browser
Visit http://localhost:5173



