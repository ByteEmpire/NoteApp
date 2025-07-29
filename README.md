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

## 📸 Screenshots

## Screenshots

<img width="1877" height="878" alt="image" src="https://github.com/user-attachments/assets/adf986d9-3f92-41a5-983a-568ca276e4e5" />

<img width="1880" height="868" alt="image" src="https://github.com/user-attachments/assets/a43cf189-5d64-456e-9ded-50c445465e62" />

<img width="1858" height="867" alt="image" src="https://github.com/user-attachments/assets/a987db4d-c68b-49c7-aefa-17ffbd3601dc" />

<img width="1754" height="354" alt="image" src="https://github.com/user-attachments/assets/77268178-70d5-4a3e-a6c7-efbb279e7505" />

<img width="1873" height="813" alt="image" src="https://github.com/user-attachments/assets/5267045b-1b12-43c0-aa59-309940ac50c2" />

<img width="1785" height="853" alt="image" src="https://github.com/user-attachments/assets/10c91698-3145-474e-ab0b-4115c3122c36" />




