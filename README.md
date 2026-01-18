# 🖼️ Image Generator App  

A full-stack **MERN Image Generator Application** that allows users to generate AI images using prompts. It includes user authentication, credit system, and secure backend APIs.

---

## 🚀 Features  

- 🔐 User Authentication (JWT based)  
- 🖼️ AI Image Generation using prompts  
- 💳 Credit-based image generation system  
- 📊 User Dashboard  
- 🌐 MongoDB Atlas Database  
- ⚡ Fast React frontend with Vite  
- 🔒 Secure API routes with middleware  

---

## 🛠️ Tech Stack  

### Frontend  

- React (Vite)  
- Axios  
- CSS  

### Backend  

- Node.js  
- Express.js  
- MongoDB Atlas  
- JWT Authentication  

---

## 📁 Project Structure  
```bash
Image-generator-app/
│
├── client/ # Frontend (React)
│
├── server/ # Backend (Node + Express)
│
└── README.md
```

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/Raushan1504/Image-generator-app.git
cd Image-generator-app
cd server
npm install
```

```bash
PORT=5000,
MONGO_URI=your_mongodb_connection_string,
JWT_SECRET=your_jwt_secret,
npm run dev,
npm start
```

### Setup Frontend
```bash
cd client
npm install
npm run dev
```
### Then open in Browser
http://localhost:5173

## 🔐 Environment Variables

You must create .env file inside server folder:
```bash
Variable	Description
MONGO_URI= MongoDB Atlas connection URL
JWT_SECRET= JWT secret key
PORT= Backend port
```
## 📌 Important Notes

Make sure MongoDB Atlas Network Access allows your IP

Do NOT upload .env file to GitHub

Always keep package-lock.json committed

Add node_modules in .gitignore

## 🧪 API Endpoints
```bash
POST /api/user/register
POST /api/user/login
POST /api/image/generate
GET  /api/user/profile
```

## 🤝 Contributing

Pull requests are welcome.
For major changes, please open an issue first.

## 📜 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Raushan Kumar
GitHub: https://github.com/Raushan1504




