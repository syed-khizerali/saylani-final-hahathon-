# ClinicOS 🏥
A full SaaS Clinic Management Platform — MERN Hackathon Project

---

## ⚡ Quick Start (3 steps)

### Step 1 — Install Node.js
Download from: https://nodejs.org (choose LTS version)
Verify: open terminal and run `node --version`

### Step 2 — Install & Run
Open terminal/command prompt in this folder and run:

```bash
npm install
npm run dev
```

### Step 3 — Open in browser
Go to: http://localhost:3000

---

## 🔐 Demo Login Credentials

| Role          | Email                  | Password |
|---------------|------------------------|----------|
| Admin         | admin@clinic.com       | password |
| Doctor        | sarah@clinic.com       | password |
| Doctor 2      | aryan@clinic.com       | password |
| Receptionist  | priya@clinic.com       | password |
| Patient       | maria@clinic.com       | password |

Click the quick demo buttons on the login screen for instant access.

---

## 🤖 Enable AI (Free — Gemini)

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google → Create API Key (FREE)
3. Open `src/App.jsx`
4. Find line: `const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";`
5. Replace `YOUR_GEMINI_API_KEY` with your actual key
6. Save and refresh — AI is now live!

---

## 🛠 Tech Stack
- React 18 + Vite
- Tailwind CSS
- Recharts (analytics)
- Gemini AI (free tier)
- JWT simulation (RBAC)

## 👥 User Roles & Features

### Admin
- Dashboard with system stats
- Add/manage doctors & receptionists  
- Analytics (revenue, appointments, trends)
- Subscription plan management
- System health monitor

### Doctor
- Today's schedule & appointments
- Patient history with diagnoses
- Write prescriptions
- AI Assistant (clinical decision support)
- Personal analytics

### Receptionist
- Register new patients
- Book appointments
- Edit patient info
- Daily schedule (hour-by-hour view)

### Patient
- Health dashboard
- Appointment history
- View & download prescriptions (PDF)
- AI medication explanations

---

## 📁 Project Structure
```
clinicos/
├── src/
│   ├── App.jsx        ← All components (single file)
│   ├── main.jsx       ← React entry point
│   └── index.css      ← Tailwind + global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```
