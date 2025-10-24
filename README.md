# 🚀 SkillStack  
*A Personal Skill-Building Tracker for Courses, Tutorials, and Certifications*

SkillStack helps learners track their growth by adding, editing, and organizing skills they’re learning.  
It lets users monitor their progress visually, take quick notes, and stay consistent with their learning goals.

---

## 📚 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Contributors](#-contributors)

---

## 🧠 Overview
SkillStack is a full-stack web application built with **React (frontend)** and **Django REST Framework (backend)**.  
It allows users to:
- Add and manage their skills  
- Write notes for each skill  
- Visualize progress through charts  
- Stay motivated in their learning journey

---

## ✨ Features
✅ Add, Edit, and Delete Skills  
✅ Track skill progress visually  
✅ Add personal notes under each skill  
✅ Responsive and clean UI  
✅ CORS-enabled backend for smooth API communication  
✅ Environment-variable-based configuration for security

---

## 🧰 Tech Stack
**Frontend:** React, Axios, Chart.js, Tailwind CSS  
**Backend:** Django REST Framework, PostgreSQL  
**Environment Handling:** python-decouple  
**CORS:** django-cors-headers  
**Deployment:**  
- Frontend → Vercel  
- Backend → Railway  



## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/SkillStack.git
cd SkillStack

2️⃣ Backend Setup
cd SkillStack_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

3️⃣ Frontend Setup
cd skillstack-frontend
npm install
npm start

4️⃣ Environment Variables

Create a .env file (or use python-decouple) in the backend with:

SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=*
DATABASE_URL=your_postgres_database_url



Frontend communicates using Axios:

axios.get("https://your-backend-url.railway.app/api/skills/")



👩‍💻 Contributors

Jeslin R – Python Full Stack Developer
📧 [jeslinrajinikanth53@gmail.com]


