# 📒 NoteApp – Secure & Feature-Rich Note Taking Application  

A modern, secure, and full-featured **Note Taking Application** built with the **MERN Stack** (MongoDB, Express, React, Node.js).  
Experience seamless OTP authentication, intuitive note management, and powerful sharing capabilities.  

---

## ✨ Key Features  

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| 🔒 **OTP Auth**        | Secure sign up/login via email with One-Time Password                       |
| 📝 **Rich Notes**      | Create, edit, and organize notes with ease                                  |
| 👁️ **Note Preview**   | View all your notes in a beautiful dashboard layout                         |
| 📤 **Export PDF**      | Download notes as PDF with jsPDF integration                                |
| ✉️ **Email Sharing**  | Share notes directly via email using FormSubmit/Resend API                  |
| 🗑️ **Smart Deletion** | Safely remove unwanted notes                                                |
| 📱 **Responsive UI**   | Flawless experience across all devices                                      |
| 🛡️ **JWT Protected**  | All routes secured with JSON Web Tokens                                     |

---

## 🛠 Tech Stack  

**Frontend**  
- React.js  
- Tailwind CSS (or vanilla CSS)  
- jsPDF  
- React Icons  

**Backend**  
- Node.js  
- Express.js  

**Database & Services**  
- MongoDB (with Mongoose)  
- JWT Authentication  
- Resend API (OTP & Email)  
- FormSubmit (Alternative Email)  

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js (v16+)  
- MongoDB Atlas account  
- Resend API key (for OTP)  

### Installation  

```bash
# Clone the repository
git clone https://github.com/ByteEmpire/NoteApp.git
cd NoteApp

# Backend setup
cd backend
npm install

# Configure environment variables
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RESEND_API_KEY=your_resend_api_key

# Start backend
npm start

# Frontend setup (in new terminal)
cd frontend
npm install
npm start
```
---

## 📸 Screenshots

<p align="center">
  <img width="1884" height="875" alt="image" src="https://github.com/user-attachments/assets/e058ebf7-fad5-424b-ab96-bdb3e969dbcd" />
  
  <img width="1881" height="866" alt="image" src="https://github.com/user-attachments/assets/5a77ec0f-da6a-4cae-a88d-a3ed889166dd" />

</p>

<p align="center">
  <img width="1882" height="876" alt="image" src="https://github.com/user-attachments/assets/27746f31-299f-4088-bc38-77af821eec78" />
  
  <img width="1919" height="813" alt="image" src="https://github.com/user-attachments/assets/57e5ba30-1704-4f85-950f-215b7c98014b" />

</p>

<p align="center">
  <img width="1903" height="868" alt="image" src="https://github.com/user-attachments/assets/d3968413-8597-46c3-bed9-67b18d9de122" />

  <img width="1909" height="882" alt="image" src="https://github.com/user-attachments/assets/cf7d1363-e8c8-4659-94ab-71f968867835" />

</p>
