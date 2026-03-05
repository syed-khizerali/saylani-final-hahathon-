import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "u1", name: "Dr. Sarah Chen", email: "sarah@clinic.com", password: "password", role: "doctor", specialty: "General Medicine", avatar: "SC", patients: 142, joined: "2023-01-15" },
  { id: "u2", name: "Dr. Aryan Mehta", email: "aryan@clinic.com", password: "password", role: "doctor", specialty: "Cardiology", avatar: "AM", patients: 98, joined: "2023-03-22" },
  { id: "u3", name: "Priya Sharma", email: "priya@clinic.com", password: "password", role: "receptionist", avatar: "PS", joined: "2023-02-10" },
  { id: "u4", name: "Liam Foster", email: "liam@clinic.com", password: "password", role: "receptionist", avatar: "LF", joined: "2023-05-01" },
  { id: "u5", name: "Admin User", email: "admin@clinic.com", password: "password", role: "admin", avatar: "AU", joined: "2022-12-01" },
  { id: "u6", name: "Maria Santos", email: "maria@clinic.com", password: "password", role: "patient", avatar: "MS", dob: "1990-04-12", phone: "+1 555-0101", bloodType: "A+", allergies: "Penicillin", joined: "2024-01-10" },
  { id: "u7", name: "James Kim", email: "james@clinic.com", password: "password", role: "patient", avatar: "JK", dob: "1985-09-23", phone: "+1 555-0202", bloodType: "O-", allergies: "None", joined: "2024-02-14" },
];

const MOCK_PATIENTS = [
  { id: "p1", name: "Maria Santos", dob: "1990-04-12", phone: "+1 555-0101", email: "maria@clinic.com", bloodType: "A+", allergies: "Penicillin", address: "123 Oak St", userId: "u6" },
  { id: "p2", name: "James Kim", dob: "1985-09-23", phone: "+1 555-0202", email: "james@clinic.com", bloodType: "O-", allergies: "None", address: "456 Pine Ave", userId: "u7" },
  { id: "p3", name: "Elena Rodriguez", dob: "1978-12-05", phone: "+1 555-0303", email: "elena@email.com", bloodType: "B+", allergies: "Sulfa drugs", address: "789 Maple Dr" },
  { id: "p4", name: "Thomas Wright", dob: "1995-07-18", phone: "+1 555-0404", email: "thomas@email.com", bloodType: "AB+", allergies: "Latex", address: "321 Cedar Ln" },
  { id: "p5", name: "Aisha Patel", dob: "2001-03-30", phone: "+1 555-0505", email: "aisha@email.com", bloodType: "A-", allergies: "None", address: "654 Birch Rd" },
];

const MOCK_APPOINTMENTS = [
  { id: "a1", patientId: "p1", patientName: "Maria Santos", doctorId: "u1", doctorName: "Dr. Sarah Chen", date: "2025-03-10", time: "09:00", status: "completed", type: "Follow-up", notes: "Routine checkup" },
  { id: "a2", patientId: "p2", patientName: "James Kim", doctorId: "u1", doctorName: "Dr. Sarah Chen", date: "2025-03-10", time: "10:00", status: "completed", type: "New Patient", notes: "" },
  { id: "a3", patientId: "p3", patientName: "Elena Rodriguez", doctorId: "u2", doctorName: "Dr. Aryan Mehta", date: "2025-03-11", time: "11:00", status: "scheduled", type: "Consultation", notes: "Chest pain evaluation" },
  { id: "a4", patientId: "p4", patientName: "Thomas Wright", doctorId: "u1", doctorName: "Dr. Sarah Chen", date: "2025-03-12", time: "14:00", status: "scheduled", type: "Follow-up", notes: "" },
  { id: "a5", patientId: "p5", patientName: "Aisha Patel", doctorId: "u2", doctorName: "Dr. Aryan Mehta", date: "2025-03-12", time: "15:30", status: "scheduled", type: "Consultation", notes: "" },
  { id: "a6", patientId: "p1", patientName: "Maria Santos", doctorId: "u2", doctorName: "Dr. Aryan Mehta", date: "2025-03-13", time: "09:30", status: "scheduled", type: "Lab Results", notes: "" },
];

const MOCK_DIAGNOSES = [
  { id: "d1", patientId: "p1", doctorId: "u1", date: "2025-02-15", diagnosis: "Hypertension Stage 1", icd: "I10", notes: "Patient presents with elevated BP readings over 3 months.", symptoms: "Headaches, dizziness, elevated BP" },
  { id: "d2", patientId: "p2", doctorId: "u1", date: "2025-02-20", diagnosis: "Type 2 Diabetes Mellitus", icd: "E11", notes: "HbA1c 7.2%. Begin metformin therapy.", symptoms: "Fatigue, increased thirst, frequent urination" },
  { id: "d3", patientId: "p1", doctorId: "u1", date: "2025-03-01", diagnosis: "Seasonal Allergic Rhinitis", icd: "J30.1", notes: "Moderate symptoms. Antihistamine prescribed.", symptoms: "Sneezing, nasal congestion, itchy eyes" },
];

const MOCK_PRESCRIPTIONS = [
  { id: "rx1", patientId: "p1", doctorId: "u1", doctorName: "Dr. Sarah Chen", date: "2025-02-15", medications: [{ name: "Amlodipine", dose: "5mg", frequency: "Once daily", duration: "30 days" }, { name: "Lisinopril", dose: "10mg", frequency: "Once daily", duration: "30 days" }], notes: "Take with or without food. Monitor BP daily.", diagnosisId: "d1" },
  { id: "rx2", patientId: "p2", doctorId: "u1", doctorName: "Dr. Sarah Chen", date: "2025-02-20", medications: [{ name: "Metformin", dose: "500mg", frequency: "Twice daily with meals", duration: "90 days" }], notes: "Take with food to minimize GI side effects.", diagnosisId: "d2" },
  { id: "rx3", patientId: "p1", doctorId: "u1", doctorName: "Dr. Sarah Chen", date: "2025-03-01", medications: [{ name: "Cetirizine", dose: "10mg", frequency: "Once daily at night", duration: "14 days" }], notes: "May cause drowsiness. Avoid alcohol.", diagnosisId: "d3" },
];

const analyticsData = {
  monthly: [
    { month: "Oct", appointments: 145, patients: 38, revenue: 14500 },
    { month: "Nov", appointments: 162, patients: 45, revenue: 16200 },
    { month: "Dec", appointments: 138, patients: 31, revenue: 13800 },
    { month: "Jan", appointments: 175, patients: 52, revenue: 17500 },
    { month: "Feb", appointments: 192, patients: 58, revenue: 19200 },
    { month: "Mar", appointments: 210, patients: 63, revenue: 21000 },
  ],
  diagnosisTypes: [
    { name: "General Medicine", value: 42, color: "#14b8a6" },
    { name: "Cardiology", value: 28, color: "#6366f1" },
    { name: "Orthopedics", value: 15, color: "#f59e0b" },
    { name: "Dermatology", value: 10, color: "#ec4899" },
    { name: "Other", value: 5, color: "#64748b" },
  ],
  weeklyAppts: [
    { day: "Mon", count: 32 }, { day: "Tue", count: 28 }, { day: "Wed", count: 35 },
    { day: "Thu", count: 30 }, { day: "Fri", count: 25 }, { day: "Sat", count: 18 }, { day: "Sun", count: 8 },
  ],
};

// ─── AI HELPER (Gemini Free API) ──────────────────────────────────────────────
// To enable AI: get a free key at https://aistudio.google.com/app/apikey
// Then replace "YOUR_GEMINI_API_KEY" below with your actual key
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";

async function callAI(prompt, context = "") {
  // Fallback responses when no API key is set
  if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    return {
      success: false,
      text: `⚠️ AI Demo Mode (No API Key)\n\nTo enable real AI responses:\n1. Get a FREE Gemini API key at: https://aistudio.google.com/app/apikey\n2. Open src/App.jsx\n3. Replace "YOUR_GEMINI_API_KEY" with your key\n\n--- Sample Response ---\nFor "${prompt.slice(0, 60)}...":\n\nThis would provide clinical decision support including differential diagnoses, treatment guidelines, and drug interaction information powered by Gemini AI.`
    };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: `You are MediAssist AI, a clinical decision support assistant for ClinicOS. Help doctors with differential diagnosis, drug interactions, and treatment guidelines. Always remind to verify with clinical judgment. Be concise and structured. ${context}` }]
          },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.4 }
        })
      }
    );
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response");
    return { success: true, text };
  } catch (err) {
    return {
      success: false,
      text: `AI service unavailable (${err.message}). Please check your API key and internet connection. Apply clinical judgment independently.`
    };
  }
}

// ─── PDF GENERATOR ────────────────────────────────────────────────────────────
function generatePrescriptionPDF(rx, patient, doctor) {
  const content = `CLINICOS MEDICAL CENTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRESCRIPTION

Date: ${rx.date}
Prescription ID: ${rx.id.toUpperCase()}

PATIENT INFORMATION:
Name: ${patient?.name || "N/A"}
Date of Birth: ${patient?.dob || "N/A"}
Blood Type: ${patient?.bloodType || "N/A"}
Allergies: ${patient?.allergies || "None"}

PRESCRIBING PHYSICIAN:
${doctor?.name || rx.doctorName}
ClinicOS Medical Center

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MEDICATIONS:
${rx.medications.map((m, i) => `
${i + 1}. ${m.name} - ${m.dose}
   Frequency: ${m.frequency}
   Duration: ${m.duration}
`).join("")}

INSTRUCTIONS:
${rx.notes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This prescription is valid for 30 days from date of issue.
Generated by ClinicOS v2.0 | www.clinicos.health`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `prescription_${rx.id}_${(patient?.name || "patient").replace(/ /g, "_")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── AUTH HELPERS ─────────────────────────────────────────────────────────────
function createToken(user) {
  return btoa(JSON.stringify({ id: user.id, role: user.role, name: user.name, exp: Date.now() + 3600000 }));
}

// ─── STORE HOOK ───────────────────────────────────────────────────────────────
function useStore() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [diagnoses, setDiagnoses] = useState(MOCK_DIAGNOSES);
  const [prescriptions, setPrescriptions] = useState(MOCK_PRESCRIPTIONS);
  return { users, setUsers, patients, setPatients, appointments, setAppointments, diagnoses, setDiagnoses, prescriptions, setPrescriptions };
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
const Avatar = ({ initials, size = "md", color = "teal" }) => {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-xl" };
  const colors = { teal: "bg-teal-500", indigo: "bg-indigo-500", amber: "bg-amber-500", rose: "bg-rose-500", slate: "bg-slate-500" };
  return (
    <div className={`${sizes[size]} ${colors[color] || "bg-teal-500"} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700", success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700", danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700", teal: "bg-teal-100 text-teal-700", indigo: "bg-indigo-100 text-indigo-700",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>{children}</span>;
};

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md hover:border-teal-200 transition-all" : ""} ${className}`}>
    {children}
  </div>
);

const Modal = ({ title, children, onClose, size = "md" }) => {
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.7)" }}>
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors text-lg font-bold">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
    <input {...props} className={`px-4 py-3 rounded-xl border ${error ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all text-sm`} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
    <textarea {...props} className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all text-sm resize-none" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
    <select {...props} className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all text-sm">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled, className = "", type = "button" }) => {
  const variants = {
    primary: "bg-teal-500 hover:bg-teal-600 text-white shadow-sm",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    danger: "bg-red-50 hover:bg-red-100 text-red-600",
    indigo: "bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm",
    ghost: "bg-transparent hover:bg-slate-50 text-slate-600 border border-slate-200",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3 text-base" };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {children}
    </button>
  );
};

const StatCard = ({ icon, label, value, sub, color = "teal" }) => {
  const colors = { teal: "bg-teal-50 text-teal-600", indigo: "bg-indigo-50 text-indigo-600", amber: "bg-amber-50 text-amber-600", rose: "bg-rose-50 text-rose-600" };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${colors[color]} flex items-center justify-center text-xl`}>{icon}</div>
      </div>
    </Card>
  );
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);

  const demoRoles = [
    { role: "admin", email: "admin@clinic.com", label: "Admin", icon: "🛡️" },
    { role: "doctor", email: "sarah@clinic.com", label: "Doctor", icon: "👨‍⚕️" },
    { role: "receptionist", email: "priya@clinic.com", label: "Receptionist", icon: "🧑‍💼" },
    { role: "patient", email: "maria@clinic.com", label: "Patient", icon: "👤" },
  ];

  const handleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user, createToken(user));
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f4c75 100%)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-1/2 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-teal-400" style={{ width: `${(i + 1) * 130}px`, height: `${(i + 1) * 130}px`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-teal-400 rounded-2xl flex items-center justify-center text-slate-900 font-black text-lg">+</div>
            <span className="text-2xl font-black">ClinicOS</span>
          </div>
          <h1 className="text-5xl font-black leading-tight mb-6">The Future of<br /><span className="text-teal-400">Clinic Management</span></h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-md">
            Digitize your clinic operations with intelligent AI assistance. Manage patients, appointments, prescriptions, and analytics — all in one platform.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          {[{ icon: "🤖", t: "AI-Powered", d: "Clinical decision support" }, { icon: "📊", t: "Analytics", d: "Real-time insights" }, { icon: "🔒", t: "RBAC Security", d: "Role-based access" }, { icon: "📱", t: "Digital Records", d: "Paperless workflow" }].map(f => (
            <div key={f.t} className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-bold text-sm">{f.t}</div>
              <div className="text-slate-400 text-xs">{f.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white font-black">+</div>
              <span className="text-xl font-black text-slate-800">ClinicOS</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-6">Sign in to your account</p>

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {demoRoles.map(d => (
                <button key={d.role} onClick={() => { setSelectedDemo(d.role); setEmail(d.email); setPassword("password"); setError(""); }}
                  className={`p-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${selectedDemo === d.role ? "bg-teal-500 text-white shadow-md" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
                  <span>{d.icon}</span><span>{d.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">or sign in manually</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="flex flex-col gap-4">
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@clinic.com" />
              <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" error={error}
                onKeyDown={e => e.key === "Enter" && handleLogin()} />
              <Btn onClick={handleLogin} disabled={loading} size="lg" className="w-full justify-center">
                {loading ? "Signing in..." : "Sign In →"}
              </Btn>
            </div>
            <p className="text-center text-xs text-slate-400 mt-5">All demo passwords: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono">password</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const navItems = {
    admin: [
      { id: "dashboard", icon: "📊", label: "Dashboard" }, { id: "doctors", icon: "👨‍⚕️", label: "Doctors" },
      { id: "receptionists", icon: "🧑‍💼", label: "Receptionists" }, { id: "patients", icon: "👥", label: "Patients" },
      { id: "analytics", icon: "📈", label: "Analytics" }, { id: "subscription", icon: "💳", label: "Subscription" },
      { id: "system", icon: "⚙️", label: "System" },
    ],
    doctor: [
      { id: "dashboard", icon: "📊", label: "Dashboard" }, { id: "appointments", icon: "📅", label: "Appointments" },
      { id: "patients", icon: "👥", label: "My Patients" }, { id: "prescriptions", icon: "💊", label: "Prescriptions" },
      { id: "ai", icon: "🤖", label: "AI Assistant" }, { id: "analytics", icon: "📈", label: "My Analytics" },
    ],
    receptionist: [
      { id: "dashboard", icon: "📊", label: "Dashboard" }, { id: "register", icon: "➕", label: "Register Patient" },
      { id: "appointments", icon: "📅", label: "Appointments" }, { id: "patients", icon: "👥", label: "Patients" },
      { id: "schedule", icon: "🗓️", label: "Daily Schedule" },
    ],
    patient: [
      { id: "dashboard", icon: "🏠", label: "My Health" }, { id: "appointments", icon: "📅", label: "Appointments" },
      { id: "prescriptions", icon: "💊", label: "Prescriptions" }, { id: "profile", icon: "👤", label: "My Profile" },
    ],
  };

  const roleBadge = { admin: "🛡️ Admin", doctor: "👨‍⚕️ Doctor", receptionist: "🧑‍💼 Receptionist", patient: "👤 Patient" };
  const items = navItems[user.role] || [];

  return (
    <div className="w-64 min-h-screen flex flex-col bg-white border-r border-slate-100 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-500 rounded-2xl flex items-center justify-center text-white font-black text-base">+</div>
          <div><div className="font-black text-slate-800 text-lg leading-none">ClinicOS</div><div className="text-xs text-slate-400 font-medium">v2.0</div></div>
        </div>
      </div>
      <div className="p-4 mx-3 mt-3 rounded-2xl" style={{ background: "linear-gradient(135deg, #f0fdfa, #e0f2fe)" }}>
        <div className="flex items-center gap-3">
          <Avatar initials={user.avatar || user.name.slice(0, 2).toUpperCase()} size="md" />
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-800 truncate">{user.name}</div>
            <div className="text-xs text-teal-600 font-semibold">{roleBadge[user.role]}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 pt-4">
        <div className="flex flex-col gap-1">
          {items.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.id ? "bg-teal-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"}`}>
              <span className="text-base">{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className="p-3 border-t border-slate-100">
        <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <span>🚪</span><span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

// ─── ADMIN PAGES ──────────────────────────────────────────────────────────────
function AdminDashboard({ store }) {
  const { users, patients, appointments } = store;
  const doctors = users.filter(u => u.role === "doctor");
  const scheduled = appointments.filter(a => a.status === "scheduled");
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">Admin Dashboard</h1><p className="text-slate-500 text-sm">System overview</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="👨‍⚕️" label="Doctors" value={doctors.length} color="indigo" />
        <StatCard icon="🧑‍💼" label="Receptionists" value={users.filter(u => u.role === "receptionist").length} color="teal" />
        <StatCard icon="👥" label="Patients" value={patients.length} color="amber" />
        <StatCard icon="📅" label="Upcoming" value={scheduled.length} color="rose" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-700 mb-4">Monthly Appointments</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData.monthly}>
              <defs><linearGradient id="cA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} /><stop offset="95%" stopColor="#14b8a6" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
              <Area type="monotone" dataKey="appointments" stroke="#14b8a6" strokeWidth={2} fill="url(#cA)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-slate-700 mb-4">Diagnosis Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={analyticsData.diagnosisTypes} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
              {analyticsData.diagnosisTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {analyticsData.diagnosisTypes.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />{d.name}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ManageDoctors({ store }) {
  const { users, setUsers } = store;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", specialty: "", password: "" });
  const doctors = users.filter(u => u.role === "doctor");
  const add = () => {
    if (!form.name || !form.email) return;
    setUsers(p => [...p, { id: `u${Date.now()}`, ...form, role: "doctor", avatar: form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(), patients: 0, joined: new Date().toISOString().slice(0, 10) }]);
    setShowModal(false); setForm({ name: "", email: "", specialty: "", password: "" });
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-slate-800">Manage Doctors</h1><p className="text-slate-500 text-sm">{doctors.length} active doctors</p></div>
        <Btn onClick={() => setShowModal(true)}>➕ Add Doctor</Btn>
      </div>
      <div className="grid gap-4">
        {doctors.map(d => (
          <Card key={d.id} className="p-5">
            <div className="flex items-center gap-4">
              <Avatar initials={d.avatar} size="lg" color="indigo" />
              <div className="flex-1"><div className="font-bold text-slate-800">{d.name}</div><div className="text-sm text-slate-500">{d.specialty}</div><div className="text-xs text-slate-400">{d.email}</div></div>
              <div className="text-right"><div className="text-2xl font-black text-indigo-600">{d.patients}</div><div className="text-xs text-slate-500">patients</div></div>
              <Badge variant="success">Active</Badge>
            </div>
          </Card>
        ))}
      </div>
      {showModal && (
        <Modal title="Add New Doctor" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dr. John Doe" />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="doctor@clinic.com" />
            <Input label="Specialty" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="Cardiology" />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            <div className="flex gap-3"><Btn onClick={add} className="flex-1 justify-center">Add Doctor</Btn><Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ManageReceptionists({ store }) {
  const { users, setUsers } = store;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const recs = users.filter(u => u.role === "receptionist");
  const add = () => {
    if (!form.name || !form.email) return;
    setUsers(p => [...p, { id: `u${Date.now()}`, ...form, role: "receptionist", avatar: form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(), joined: new Date().toISOString().slice(0, 10) }]);
    setShowModal(false); setForm({ name: "", email: "", password: "" });
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-slate-800">Manage Receptionists</h1><p className="text-slate-500 text-sm">{recs.length} active</p></div>
        <Btn onClick={() => setShowModal(true)}>➕ Add Receptionist</Btn>
      </div>
      <div className="grid gap-4">
        {recs.map(r => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center gap-4">
              <Avatar initials={r.avatar} size="lg" color="teal" />
              <div className="flex-1"><div className="font-bold text-slate-800">{r.name}</div><div className="text-sm text-slate-500">Front Desk</div><div className="text-xs text-slate-400">{r.email}</div></div>
              <Badge variant="success">Active</Badge>
            </div>
          </Card>
        ))}
      </div>
      {showModal && (
        <Modal title="Add Receptionist" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <div className="flex gap-3"><Btn onClick={add} className="flex-1 justify-center">Add</Btn><Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AdminAnalytics() {
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">Analytics & Reports</h1></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💰" label="Monthly Revenue" value="$21,000" sub="↑ 9.4%" color="teal" />
        <StatCard icon="📅" label="Total Appts" value="210" sub="This month" color="indigo" />
        <StatCard icon="⭐" label="Satisfaction" value="4.8/5" color="amber" />
        <StatCard icon="⚡" label="Avg Wait" value="12 min" color="rose" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-700 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData.monthly}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} /><Bar dataKey="revenue" fill="#14b8a6" radius={[6, 6, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-slate-700 mb-4">Weekly Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analyticsData.weeklyAppts}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="day" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 5 }} /></LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function SubscriptionPage() {
  const [current, setCurrent] = useState("professional");
  const plans = [
    { id: "starter", name: "Starter", price: 49, features: ["Up to 2 Doctors", "100 Patients/month", "Basic Analytics", "Email Support"] },
    { id: "professional", name: "Professional", price: 149, features: ["Up to 10 Doctors", "Unlimited Patients", "Advanced Analytics", "AI Assistant", "Priority Support"], popular: true },
    { id: "enterprise", name: "Enterprise", price: 399, features: ["Unlimited Doctors", "Unlimited Patients", "Custom Analytics", "AI Assistant Pro", "Dedicated Support", "Custom Integrations"] },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">Subscription Plans</h1></div>
      <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center gap-4">
        <div className="text-3xl">✅</div>
        <div><div className="font-bold text-teal-800">Current Plan: Professional</div><div className="text-sm text-teal-600">Next billing: April 1, 2025 · $149/month</div></div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <Card key={plan.id} className={`p-6 relative ${current === plan.id ? "ring-2 ring-teal-500" : ""}`}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-4 py-1 rounded-full">POPULAR</div>}
            <h3 className="text-lg font-black text-slate-800">{plan.name}</h3>
            <div className="flex items-baseline gap-1 my-2"><span className="text-3xl font-black">${plan.price}</span><span className="text-slate-500 text-sm">/mo</span></div>
            <ul className="flex flex-col gap-2 mb-5">{plan.features.map(f => <li key={f} className="text-sm text-slate-600 flex items-center gap-2"><span className="text-teal-500">✓</span>{f}</li>)}</ul>
            <Btn onClick={() => setCurrent(plan.id)} variant={current === plan.id ? "primary" : "ghost"} className="w-full justify-center">{current === plan.id ? "Current Plan" : "Switch"}</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SystemMonitor({ store }) {
  const { users, patients, appointments } = store;
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">System Monitor</h1></div>
      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
        <span className="text-2xl">🟢</span><div><div className="font-bold text-emerald-800">All Systems Operational</div><div className="text-sm text-emerald-600">Last checked: just now</div></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[{ icon: "⚡", label: "API Response", value: "142ms" }, { icon: "🗄️", label: "Database", value: "Healthy" }, { icon: "🤖", label: "AI Service", value: "Operational" }, { icon: "💾", label: "Storage", value: "2.4 GB / 10 GB" }, { icon: "👥", label: "Active Sessions", value: "7" }, { icon: "📡", label: "Uptime", value: "99.9%" }].map(m => (
          <Card key={m.label} className="p-5">
            <div className="flex items-start gap-3"><div className="text-2xl">{m.icon}</div><div><div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{m.label}</div><div className="font-bold text-slate-800 mt-1">{m.value}</div><Badge variant="success">OK</Badge></div></div>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <h3 className="font-bold text-slate-700 mb-4">Data Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          {[{ v: users.length, l: "Users" }, { v: patients.length, l: "Patients" }, { v: appointments.length, l: "Appointments" }].map(s => (
            <div key={s.l} className="text-center p-4 bg-slate-50 rounded-2xl"><div className="text-3xl font-black text-slate-800">{s.v}</div><div className="text-xs text-slate-500 mt-1">{s.l}</div></div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── DOCTOR PAGES ─────────────────────────────────────────────────────────────
function DoctorDashboard({ user, store }) {
  const { appointments, prescriptions } = store;
  const myAppts = appointments.filter(a => a.doctorId === user.id);
  const todayAppts = myAppts.filter(a => a.date === "2025-03-10");
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">Welcome, {user.name.split(" ")[1]} 👋</h1><p className="text-slate-500 text-sm">Here's your day at a glance</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Today" value={todayAppts.length} color="teal" />
        <StatCard icon="⏳" label="Upcoming" value={myAppts.filter(a => a.status === "scheduled").length} color="indigo" />
        <StatCard icon="👥" label="Patients" value={[...new Set(myAppts.map(a => a.patientId))].length} color="amber" />
        <StatCard icon="💊" label="Prescriptions" value={prescriptions.filter(r => r.doctorId === user.id).length} color="rose" />
      </div>
      <Card className="p-6">
        <h3 className="font-bold text-slate-700 mb-4">Today's Schedule</h3>
        {todayAppts.length === 0 ? <div className="text-center py-8 text-slate-400">No appointments today</div> : (
          <div className="flex flex-col gap-3">
            {todayAppts.map(a => (
              <div key={a.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="text-lg font-black text-teal-600 w-16">{a.time}</div>
                <div className="flex-1"><div className="font-bold text-slate-800">{a.patientName}</div><div className="text-sm text-slate-500">{a.type}</div></div>
                <Badge variant={a.status === "completed" ? "success" : "info"}>{a.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function DoctorAppointments({ user, store }) {
  const myAppts = store.appointments.filter(a => a.doctorId === user.id);
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? myAppts : myAppts.filter(a => a.status === filter);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-slate-800">My Appointments</h1><p className="text-slate-500 text-sm">{myAppts.length} total</p></div>
        <div className="flex gap-2">
          {["all", "scheduled", "completed"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map(a => (
          <Card key={a.id} className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-20 shrink-0 text-center"><div className="text-xs text-slate-500">{a.date}</div><div className="text-xl font-black text-teal-600">{a.time}</div></div>
              <div className="flex-1"><div className="font-bold text-slate-800">{a.patientName}</div><div className="text-sm text-slate-500">{a.type}{a.notes ? ` · ${a.notes}` : ""}</div></div>
              <Badge variant={a.status === "completed" ? "success" : "info"}>{a.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DoctorPatients({ user, store }) {
  const { patients, appointments, diagnoses, prescriptions, setDiagnoses } = store;
  const myIds = [...new Set(appointments.filter(a => a.doctorId === user.id).map(a => a.patientId))];
  const myPatients = patients.filter(p => myIds.includes(p.id));
  const [selected, setSelected] = useState(null);
  const [showDiag, setShowDiag] = useState(false);
  const [diagForm, setDiagForm] = useState({ diagnosis: "", icd: "", symptoms: "", notes: "" });

  const addDx = () => {
    if (!diagForm.diagnosis) return;
    setDiagnoses(p => [...p, { id: `d${Date.now()}`, patientId: selected.id, doctorId: user.id, date: new Date().toISOString().slice(0, 10), ...diagForm }]);
    setShowDiag(false); setDiagForm({ diagnosis: "", icd: "", symptoms: "", notes: "" });
  };

  if (selected) {
    const dx = diagnoses.filter(d => d.patientId === selected.id);
    const rx = prescriptions.filter(r => r.patientId === selected.id);
    return (
      <div className="flex flex-col gap-6">
        <button onClick={() => setSelected(null)} className="text-teal-600 font-semibold text-sm hover:underline flex items-center gap-1 w-fit">← Back</button>
        <Card className="p-6">
          <div className="flex items-center gap-5">
            <Avatar initials={selected.name.slice(0, 2).toUpperCase()} size="xl" />
            <div>
              <h2 className="text-2xl font-black text-slate-800">{selected.name}</h2>
              <p className="text-slate-500">{selected.email} · {selected.phone}</p>
              <div className="flex gap-2 mt-2"><Badge variant="teal">Blood: {selected.bloodType}</Badge><Badge variant="warning">⚠ {selected.allergies}</Badge></div>
            </div>
          </div>
        </Card>
        <Btn onClick={() => setShowDiag(true)}>➕ Add Diagnosis</Btn>
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-700 mb-4">Diagnoses ({dx.length})</h3>
            {dx.length === 0 ? <p className="text-slate-400 text-sm">None recorded</p> : dx.map(d => (
              <div key={d.id} className="p-4 rounded-xl bg-slate-50 mb-3">
                <div className="flex justify-between mb-1"><div className="font-bold text-slate-800 text-sm">{d.diagnosis}</div><Badge variant="indigo">{d.icd}</Badge></div>
                <div className="text-xs text-slate-500">{d.date} · {d.notes}</div>
              </div>
            ))}
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-slate-700 mb-4">Prescriptions ({rx.length})</h3>
            {rx.length === 0 ? <p className="text-slate-400 text-sm">None</p> : rx.map(r => (
              <div key={r.id} className="p-4 rounded-xl bg-slate-50 mb-3">
                <div className="text-xs text-slate-400 mb-1">{r.date}</div>
                {r.medications.map(m => <div key={m.name} className="text-sm font-semibold text-slate-700">{m.name} — {m.dose}</div>)}
              </div>
            ))}
          </Card>
        </div>
        {showDiag && (
          <Modal title="Add Diagnosis" onClose={() => setShowDiag(false)}>
            <div className="flex flex-col gap-4">
              <Input label="Diagnosis" value={diagForm.diagnosis} onChange={e => setDiagForm({ ...diagForm, diagnosis: e.target.value })} placeholder="e.g., Hypertension Stage 1" />
              <Input label="ICD-10 Code" value={diagForm.icd} onChange={e => setDiagForm({ ...diagForm, icd: e.target.value })} placeholder="e.g., I10" />
              <Input label="Symptoms" value={diagForm.symptoms} onChange={e => setDiagForm({ ...diagForm, symptoms: e.target.value })} />
              <Textarea label="Notes" value={diagForm.notes} onChange={e => setDiagForm({ ...diagForm, notes: e.target.value })} rows={3} />
              <div className="flex gap-3"><Btn onClick={addDx} className="flex-1 justify-center">Save</Btn><Btn variant="secondary" onClick={() => setShowDiag(false)}>Cancel</Btn></div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">My Patients</h1><p className="text-slate-500 text-sm">{myPatients.length} patients</p></div>
      <div className="grid gap-4">
        {myPatients.map(p => (
          <Card key={p.id} className="p-5" onClick={() => setSelected(p)}>
            <div className="flex items-center gap-4">
              <Avatar initials={p.name.slice(0, 2).toUpperCase()} size="lg" />
              <div className="flex-1">
                <div className="font-bold text-slate-800">{p.name}</div>
                <div className="text-sm text-slate-500">DOB: {p.dob} · {p.phone}</div>
                <div className="flex gap-2 mt-1"><Badge variant="teal">{p.bloodType}</Badge>{p.allergies !== "None" && <Badge variant="warning">⚠ {p.allergies}</Badge>}</div>
              </div>
              <div className="text-teal-500 font-bold text-sm">View →</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DoctorPrescriptions({ user, store }) {
  const { prescriptions, patients, setPrescriptions } = store;
  const myRx = prescriptions.filter(r => r.doctorId === user.id);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientId: "", notes: "", medications: [{ name: "", dose: "", frequency: "", duration: "" }] });

  const addMed = () => setForm(f => ({ ...f, medications: [...f.medications, { name: "", dose: "", frequency: "", duration: "" }] }));
  const updMed = (i, k, v) => setForm(f => { const m = [...f.medications]; m[i] = { ...m[i], [k]: v }; return { ...f, medications: m }; });
  const save = () => {
    if (!form.patientId) return;
    setPrescriptions(p => [...p, { id: `rx${Date.now()}`, doctorId: user.id, doctorName: user.name, patientId: form.patientId, date: new Date().toISOString().slice(0, 10), medications: form.medications.filter(m => m.name), notes: form.notes }]);
    setShowModal(false); setForm({ patientId: "", notes: "", medications: [{ name: "", dose: "", frequency: "", duration: "" }] });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-slate-800">Prescriptions</h1><p className="text-slate-500 text-sm">{myRx.length} written</p></div>
        <Btn onClick={() => setShowModal(true)}>➕ New Prescription</Btn>
      </div>
      <div className="flex flex-col gap-4">
        {myRx.map(r => {
          const patient = patients.find(p => p.id === r.patientId);
          return (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div><div className="font-bold text-slate-800">{patient?.name || "Unknown"}</div><div className="text-xs text-slate-400">{r.date} · {r.id.toUpperCase()}</div></div>
                <Btn size="sm" variant="ghost" onClick={() => generatePrescriptionPDF(r, patient, user)}>⬇ Download</Btn>
              </div>
              {r.medications.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-2">
                  <div className="text-lg">💊</div>
                  <div><div className="font-semibold text-slate-700 text-sm">{m.name} — {m.dose}</div><div className="text-xs text-slate-500">{m.frequency} · {m.duration}</div></div>
                </div>
              ))}
              {r.notes && <p className="text-xs text-slate-500 mt-2 p-3 bg-blue-50 rounded-xl">📋 {r.notes}</p>}
            </Card>
          );
        })}
      </div>
      {showModal && (
        <Modal title="New Prescription" onClose={() => setShowModal(false)} size="lg">
          <div className="flex flex-col gap-4">
            <Select label="Patient" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}
              options={[{ value: "", label: "Select patient..." }, ...patients.map(p => ({ value: p.id, label: p.name }))]} />
            <div className="flex items-center justify-between mb-1"><label className="text-sm font-semibold text-slate-700">Medications</label><Btn size="sm" variant="secondary" onClick={addMed}>+ Add</Btn></div>
            {form.medications.map((m, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl">
                <Input placeholder="Drug name" value={m.name} onChange={e => updMed(i, "name", e.target.value)} />
                <Input placeholder="Dose (e.g. 10mg)" value={m.dose} onChange={e => updMed(i, "dose", e.target.value)} />
                <Input placeholder="Frequency" value={m.frequency} onChange={e => updMed(i, "frequency", e.target.value)} />
                <Input placeholder="Duration" value={m.duration} onChange={e => updMed(i, "duration", e.target.value)} />
              </div>
            ))}
            <Textarea label="Instructions" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
            <div className="flex gap-3"><Btn onClick={save} className="flex-1 justify-center">Issue Prescription</Btn><Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AIAssistant({ user }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hello Dr. ${user.name.split(" ").slice(1).join(" ")}! I'm MediAssist AI.\n\nI can help with:\n• Differential diagnosis\n• Drug interaction checks\n• Treatment guidelines\n• Patient education content\n• ICD-10 code lookup\n\nHow can I assist you today?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const quickPrompts = [
    "Differential diagnosis for chest pain in a 45-year-old male",
    "Drug interactions for Metformin and Lisinopril",
    "First-line treatment for hypertension Stage 1",
    "Explain Type 2 Diabetes for patient education",
  ];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(p => [...p, { role: "user", text: msg }]);
    setLoading(true);
    const result = await callAI(msg, `Doctor: ${user.name}, Specialty: ${user.specialty || "General Medicine"}`);
    setMessages(p => [...p, { role: "assistant", text: result.text, fallback: !result.success }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-slate-800">AI Assistant</h1><p className="text-slate-500 text-sm">Powered by Gemini AI · Clinical Decision Support</p></div>
        <Badge variant={loading ? "info" : "success"}>{loading ? "⏳ Thinking..." : "🟢 Ready"}</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map(p => (
          <button key={p} onClick={() => send(p)} className="text-xs px-3 py-2 bg-teal-50 text-teal-700 rounded-full font-medium hover:bg-teal-100 border border-teal-200 transition-colors">{p.length > 50 ? p.slice(0, 50) + "..." : p}</button>
        ))}
      </div>
      <Card className="flex flex-col" style={{ minHeight: "420px" }}>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4" style={{ maxHeight: "380px" }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${m.role === "user" ? "bg-indigo-500 text-white" : "bg-teal-500 text-white"}`}>{m.role === "user" ? "👤" : "🤖"}</div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-indigo-500 text-white rounded-tr-sm" : m.fallback ? "bg-amber-50 border border-amber-200 text-slate-700 rounded-tl-sm" : "bg-slate-100 text-slate-800 rounded-tl-sm"}`}>
                {m.fallback && <div className="text-xs font-bold text-amber-600 mb-2">⚠ Demo Mode</div>}
                <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white">🤖</div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-4 flex gap-2 items-center">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-teal-400 rounded-full" style={{ animation: `bounce 1s infinite ${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="p-4 border-t border-slate-100 flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about diagnosis, treatments, drug interactions..." disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-800 placeholder-slate-400" />
          <Btn onClick={() => send()} disabled={loading || !input.trim()}>Send</Btn>
        </div>
      </Card>
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-700">
        ⚠️ <strong>Medical Disclaimer:</strong> AI suggestions are for educational purposes only. Always apply clinical judgment. To enable Gemini AI: get a free key at <strong>aistudio.google.com</strong> and paste it in <code>src/App.jsx</code> line 1 (GEMINI_API_KEY).
      </div>
    </div>
  );
}

function DoctorAnalytics({ user, store }) {
  const myAppts = store.appointments.filter(a => a.doctorId === user.id);
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">My Analytics</h1></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Total Appts" value={myAppts.length} color="teal" />
        <StatCard icon="✅" label="Completed" value={myAppts.filter(a => a.status === "completed").length} color="indigo" />
        <StatCard icon="💊" label="Prescriptions" value={store.prescriptions.filter(r => r.doctorId === user.id).length} color="amber" />
        <StatCard icon="📋" label="Diagnoses" value={store.diagnoses.filter(d => d.doctorId === user.id).length} color="rose" />
      </div>
      <Card className="p-6">
        <h3 className="font-bold text-slate-700 mb-4">Monthly Performance</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={analyticsData.monthly}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="appointments" fill="#6366f1" radius={[6, 6, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── RECEPTIONIST PAGES ───────────────────────────────────────────────────────
function ReceptionistDashboard({ user, store }) {
  const { appointments, patients } = store;
  const today = appointments.filter(a => a.date === "2025-03-10");
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">Welcome, {user.name.split(" ")[0]} 👋</h1></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Today's Appts" value={today.length} color="teal" />
        <StatCard icon="👥" label="Total Patients" value={patients.length} color="indigo" />
        <StatCard icon="⏳" label="Pending" value={appointments.filter(a => a.status === "scheduled").length} color="amber" />
        <StatCard icon="✅" label="Completed" value={today.filter(a => a.status === "completed").length} color="rose" />
      </div>
      <Card className="p-6">
        <h3 className="font-bold text-slate-700 mb-4">Today's Appointments</h3>
        <div className="flex flex-col gap-3">
          {today.map(a => (
            <div key={a.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="text-teal-600 font-black text-lg w-16">{a.time}</div>
              <div className="flex-1"><div className="font-bold text-slate-800">{a.patientName}</div><div className="text-xs text-slate-500">with {a.doctorName} · {a.type}</div></div>
              <Badge variant={a.status === "completed" ? "success" : "info"}>{a.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RegisterPatient({ store }) {
  const { setPatients } = store;
  const [form, setForm] = useState({ name: "", dob: "", phone: "", email: "", bloodType: "", allergies: "", address: "" });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.phone) e.phone = "Required";
    if (!form.dob) e.dob = "Required";
    if (Object.keys(e).length) { setErrors(e); return; }
    setPatients(p => [...p, { id: `p${Date.now()}`, ...form, allergies: form.allergies || "None" }]);
    setSuccess(true);
    setForm({ name: "", dob: "", phone: "", email: "", bloodType: "", allergies: "", address: "" });
    setErrors({});
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div><h1 className="text-2xl font-black text-slate-800">Register New Patient</h1></div>
      {success && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-semibold">✅ Patient registered successfully!</div>}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Patient full name" error={errors.name} /></div>
          <Input label="Date of Birth *" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} error={errors.dob} />
          <Input label="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 555-0000" error={errors.phone} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="patient@email.com" />
          <Select label="Blood Type" value={form.bloodType} onChange={e => setForm({ ...form, bloodType: e.target.value })}
            options={[{ value: "", label: "Unknown" }, ...["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(b => ({ value: b, label: b }))]} />
          <Input label="Allergies" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} placeholder="None / Penicillin" />
          <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main St" />
        </div>
        <div className="mt-6"><Btn onClick={submit} size="lg">Register Patient</Btn></div>
      </Card>
    </div>
  );
}

function ManageAppointments({ store }) {
  const { appointments, setAppointments, patients, users } = store;
  const doctors = users.filter(u => u.role === "doctor");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientId: "", doctorId: "", date: "", time: "", type: "Consultation", notes: "" });

  const book = () => {
    if (!form.patientId || !form.doctorId || !form.date || !form.time) return;
    const patient = patients.find(p => p.id === form.patientId);
    const doctor = doctors.find(d => d.id === form.doctorId);
    setAppointments(p => [...p, { id: `a${Date.now()}`, ...form, status: "scheduled", patientName: patient?.name || "", doctorName: doctor?.name || "" }]);
    setShowModal(false); setForm({ patientId: "", doctorId: "", date: "", time: "", type: "Consultation", notes: "" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-slate-800">Appointments</h1><p className="text-slate-500 text-sm">{appointments.length} total</p></div>
        <Btn onClick={() => setShowModal(true)}>📅 Book Appointment</Btn>
      </div>
      <div className="flex flex-col gap-3">
        {appointments.map(a => (
          <Card key={a.id} className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-20 shrink-0 text-center"><div className="text-xs text-slate-500">{a.date}</div><div className="text-xl font-black text-teal-600">{a.time}</div></div>
              <div className="flex-1"><div className="font-bold text-slate-800">{a.patientName}</div><div className="text-sm text-slate-500">{a.doctorName} · {a.type}</div></div>
              <Badge variant={a.status === "completed" ? "success" : "info"}>{a.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
      {showModal && (
        <Modal title="Book Appointment" onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-4">
            <Select label="Patient" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}
              options={[{ value: "", label: "Select patient..." }, ...patients.map(p => ({ value: p.id, label: p.name }))]} />
            <Select label="Doctor" value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })}
              options={[{ value: "", label: "Select doctor..." }, ...doctors.map(d => ({ value: d.id, label: d.name }))]} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              <Input label="Time" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
            <Select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              options={["Consultation", "Follow-up", "New Patient", "Lab Results", "Procedure"].map(t => ({ value: t, label: t }))} />
            <Textarea label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Optional..." />
            <div className="flex gap-3"><Btn onClick={book} className="flex-1 justify-center">Book</Btn><Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AllPatients({ store }) {
  const { patients, setPatients } = store;
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.phone || "").includes(search));

  const save = () => { setPatients(p => p.map(x => x.id === editing.id ? editing : x)); setEditing(null); };

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">All Patients</h1><p className="text-slate-500 text-sm">{patients.length} registered</p></div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name or phone..."
        className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm" />
      <div className="grid gap-3">
        {filtered.map(p => (
          <Card key={p.id} className="p-5">
            <div className="flex items-center gap-4">
              <Avatar initials={p.name.slice(0, 2).toUpperCase()} />
              <div className="flex-1">
                <div className="font-bold text-slate-800">{p.name}</div>
                <div className="text-sm text-slate-500">{p.phone} · {p.email}</div>
                <div className="flex gap-2 mt-1">{p.bloodType && <Badge variant="teal">{p.bloodType}</Badge>}{p.allergies && p.allergies !== "None" && <Badge variant="warning">⚠ {p.allergies}</Badge>}</div>
              </div>
              <Btn size="sm" variant="ghost" onClick={() => setEditing({ ...p })}>✏ Edit</Btn>
            </div>
          </Card>
        ))}
      </div>
      {editing && (
        <Modal title="Edit Patient" onClose={() => setEditing(null)}>
          <div className="flex flex-col gap-4">
            <Input label="Name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
            <Input label="Phone" value={editing.phone || ""} onChange={e => setEditing({ ...editing, phone: e.target.value })} />
            <Input label="Email" value={editing.email || ""} onChange={e => setEditing({ ...editing, email: e.target.value })} />
            <Input label="Allergies" value={editing.allergies || ""} onChange={e => setEditing({ ...editing, allergies: e.target.value })} />
            <div className="flex gap-3"><Btn onClick={save} className="flex-1 justify-center">Save</Btn><Btn variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DailySchedule({ store }) {
  const { appointments, users } = store;
  const doctors = users.filter(u => u.role === "doctor");
  const [selectedDate, setSelectedDate] = useState("2025-03-10");
  const [selectedDoc, setSelectedDoc] = useState("all");
  const filtered = appointments.filter(a => a.date === selectedDate && (selectedDoc === "all" || a.doctorId === selectedDoc));
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">Daily Schedule</h1></div>
      <div className="flex gap-4 flex-wrap">
        <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        <Select value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)}
          options={[{ value: "all", label: "All Doctors" }, ...doctors.map(d => ({ value: d.id, label: d.name }))]} />
      </div>
      <Card className="p-6">
        <div className="flex flex-col gap-2">
          {hours.map(hour => {
            const appt = filtered.find(a => a.time === hour);
            return (
              <div key={hour} className={`flex items-center gap-4 p-3 rounded-xl ${appt ? "bg-teal-50 border border-teal-100" : "bg-slate-50"}`}>
                <div className="w-16 text-sm font-bold text-slate-500 shrink-0">{hour}</div>
                {appt ? (
                  <div className="flex-1 flex items-center justify-between">
                    <div><div className="font-bold text-slate-800 text-sm">{appt.patientName}</div><div className="text-xs text-teal-600">{appt.doctorName} · {appt.type}</div></div>
                    <Badge variant={appt.status === "completed" ? "success" : "info"}>{appt.status}</Badge>
                  </div>
                ) : <div className="text-xs text-slate-400 italic">Available</div>}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── PATIENT PAGES ─────────────────────────────────────────────────────────────
function PatientDashboard({ user, store }) {
  const { patients, appointments, prescriptions } = store;
  const me = patients.find(p => p.userId === user.id || p.email === user.email);
  const myAppts = me ? appointments.filter(a => a.patientId === me.id) : [];
  const myRx = me ? prescriptions.filter(r => r.patientId === me.id) : [];

  if (!me) return <Card className="p-8 text-center"><div className="text-4xl mb-3">👤</div><div className="font-bold text-slate-700">No patient record found</div><p className="text-slate-500 text-sm mt-1">Contact the front desk to register your account.</p></Card>;

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">My Health Dashboard</h1></div>
      <Card className="p-6" style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", color: "white" }}>
        <div className="flex items-center gap-5">
          <Avatar initials={me.name.slice(0, 2).toUpperCase()} size="xl" />
          <div>
            <div className="text-2xl font-black">{me.name}</div>
            <div className="text-slate-300 text-sm mt-1">{me.email}</div>
            <div className="flex gap-4 mt-3">
              <div><div className="text-xs text-slate-400">Blood Type</div><div className="font-bold text-teal-400">{me.bloodType || "N/A"}</div></div>
              <div className="w-px bg-slate-600" />
              <div><div className="text-xs text-slate-400">Allergies</div><div className="font-bold text-amber-400">{me.allergies || "None"}</div></div>
              <div className="w-px bg-slate-600" />
              <div><div className="text-xs text-slate-400">DOB</div><div className="font-bold text-white">{me.dob || "N/A"}</div></div>
            </div>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-3 gap-4">
        <StatCard icon="📅" label="Total Visits" value={myAppts.length} color="teal" />
        <StatCard icon="💊" label="Prescriptions" value={myRx.length} color="indigo" />
        <StatCard icon="✅" label="Completed" value={myAppts.filter(a => a.status === "completed").length} color="amber" />
      </div>
      <Card className="p-6">
        <h3 className="font-bold text-slate-700 mb-4">Recent Appointments</h3>
        {myAppts.length === 0 ? <p className="text-slate-400 text-sm">No appointments yet</p> : (
          <div className="flex flex-col gap-3">
            {myAppts.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="text-center shrink-0"><div className="text-xs text-slate-500">{a.date}</div><div className="font-black text-teal-600">{a.time}</div></div>
                <div className="flex-1"><div className="font-semibold text-slate-800 text-sm">{a.doctorName}</div><div className="text-xs text-slate-500">{a.type}</div></div>
                <Badge variant={a.status === "completed" ? "success" : "info"}>{a.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function PatientAppointments({ user, store }) {
  const me = store.patients.find(p => p.userId === user.id || p.email === user.email);
  const myAppts = me ? store.appointments.filter(a => a.patientId === me.id) : [];
  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">My Appointments</h1></div>
      {myAppts.length === 0 ? <Card className="p-8 text-center"><div className="text-4xl mb-3">📅</div><div className="font-bold text-slate-700">No appointments yet</div></Card> : (
        <div className="flex flex-col gap-4">
          {myAppts.map(a => (
            <Card key={a.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="text-center w-20 shrink-0 p-3 bg-teal-50 rounded-xl"><div className="text-xs text-teal-600 font-semibold">{a.date.slice(5)}</div><div className="text-xl font-black text-teal-700">{a.time}</div></div>
                <div className="flex-1"><div className="font-bold text-slate-800">{a.doctorName}</div><div className="text-sm text-slate-500">{a.type}</div>{a.notes && <div className="text-xs text-slate-400 mt-1">📝 {a.notes}</div>}</div>
                <Badge variant={a.status === "completed" ? "success" : "info"}>{a.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PatientPrescriptions({ user, store }) {
  const { patients, prescriptions } = store;
  const me = patients.find(p => p.userId === user.id || p.email === user.email);
  const myRx = me ? prescriptions.filter(r => r.patientId === me.id) : [];
  const [aiExp, setAiExp] = useState({});
  const [loadingAi, setLoadingAi] = useState({});

  const explain = async (rx) => {
    setLoadingAi(p => ({ ...p, [rx.id]: true }));
    const meds = rx.medications.map(m => `${m.name} ${m.dose}`).join(", ");
    const result = await callAI(`Explain these medications in simple patient-friendly language: ${meds}. What does each do, side effects to watch for, and key instructions.`, "Audience: patient, not a doctor. Keep it clear and reassuring.");
    setAiExp(p => ({ ...p, [rx.id]: result.text }));
    setLoadingAi(p => ({ ...p, [rx.id]: false }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-2xl font-black text-slate-800">My Prescriptions</h1></div>
      {myRx.length === 0 ? <Card className="p-8 text-center"><div className="text-4xl mb-3">💊</div><div className="font-bold text-slate-700">No prescriptions yet</div></Card> : (
        myRx.map(r => (
          <Card key={r.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div><div className="font-bold text-slate-800">Prescribed by {r.doctorName}</div><div className="text-xs text-slate-400">{r.date} · {r.id.toUpperCase()}</div></div>
              <Btn size="sm" variant="ghost" onClick={() => generatePrescriptionPDF(r, me, null)}>⬇ Download</Btn>
            </div>
            {r.medications.map((m, i) => (
              <div key={i} className="flex gap-3 p-3 bg-teal-50 rounded-xl border border-teal-100 mb-2">
                <div className="text-xl">💊</div>
                <div><div className="font-bold text-teal-800 text-sm">{m.name} — {m.dose}</div><div className="text-xs text-teal-600">{m.frequency} for {m.duration}</div></div>
              </div>
            ))}
            {r.notes && <p className="text-xs text-slate-500 mb-4 p-3 bg-blue-50 rounded-xl">📋 {r.notes}</p>}
            {!aiExp[r.id] && <Btn size="sm" variant="indigo" onClick={() => explain(r)} disabled={loadingAi[r.id]}>{loadingAi[r.id] ? "⏳ Loading..." : "🤖 Explain my medications (AI)"}</Btn>}
            {aiExp[r.id] && (
              <div className="mt-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-2"><span>🤖</span><span className="text-xs font-bold text-indigo-700">AI Explanation</span></div>
                <p className="text-sm text-slate-700 leading-relaxed" style={{ whiteSpace: "pre-wrap" }}>{aiExp[r.id]}</p>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}

function PatientProfile({ user, store }) {
  const { patients, setPatients } = store;
  const me = patients.find(p => p.userId === user.id || p.email === user.email);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(me || {});

  if (!me) return <Card className="p-8 text-center"><div className="text-4xl mb-3">👤</div><div className="font-bold text-slate-700">No patient record found</div></Card>;

  const save = () => { setPatients(p => p.map(x => x.id === form.id ? form : x)); setEditing(false); };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black text-slate-800">My Profile</h1></div>
        {!editing && <Btn onClick={() => setEditing(true)} variant="ghost">✏ Edit</Btn>}
      </div>
      <Card className="p-6">
        {editing ? (
          <div className="flex flex-col gap-4">
            <Input label="Phone" value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <Input label="Email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Address" value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })} />
            <Input label="Allergies" value={form.allergies || ""} onChange={e => setForm({ ...form, allergies: e.target.value })} />
            <div className="flex gap-3"><Btn onClick={save} className="flex-1 justify-center">Save</Btn><Btn variant="secondary" onClick={() => setEditing(false)}>Cancel</Btn></div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-5 mb-5"><Avatar initials={me.name.slice(0, 2).toUpperCase()} size="xl" /><div><div className="text-2xl font-black text-slate-800">{me.name}</div><div className="text-slate-500 text-sm">{me.email}</div></div></div>
            {[{ l: "Date of Birth", v: me.dob, i: "🎂" }, { l: "Phone", v: me.phone, i: "📱" }, { l: "Address", v: me.address, i: "🏠" }, { l: "Blood Type", v: me.bloodType, i: "🩸" }, { l: "Allergies", v: me.allergies || "None", i: "⚠️" }].map(f => (
              <div key={f.l} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-2">
                <div className="text-xl w-8">{f.i}</div>
                <div><div className="text-xs text-slate-500 font-semibold">{f.l}</div><div className="font-semibold text-slate-800 text-sm">{f.v || "Not provided"}</div></div>
              </div>
            ))}
          </>
        )}
      </Card>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const store = useStore();

  const handleLogin = (u, t) => { setUser(u); setActiveTab("dashboard"); };
  const handleLogout = () => setUser(null);

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const renderContent = () => {
    if (user.role === "admin") {
      const map = { dashboard: <AdminDashboard store={store} />, doctors: <ManageDoctors store={store} />, receptionists: <ManageReceptionists store={store} />, patients: <AllPatients store={store} />, analytics: <AdminAnalytics />, subscription: <SubscriptionPage />, system: <SystemMonitor store={store} /> };
      return map[activeTab] || map.dashboard;
    }
    if (user.role === "doctor") {
      const map = { dashboard: <DoctorDashboard user={user} store={store} />, appointments: <DoctorAppointments user={user} store={store} />, patients: <DoctorPatients user={user} store={store} />, prescriptions: <DoctorPrescriptions user={user} store={store} />, ai: <AIAssistant user={user} />, analytics: <DoctorAnalytics user={user} store={store} /> };
      return map[activeTab] || map.dashboard;
    }
    if (user.role === "receptionist") {
      const map = { dashboard: <ReceptionistDashboard user={user} store={store} />, register: <RegisterPatient store={store} />, appointments: <ManageAppointments store={store} />, patients: <AllPatients store={store} />, schedule: <DailySchedule store={store} /> };
      return map[activeTab] || map.dashboard;
    }
    if (user.role === "patient") {
      const map = { dashboard: <PatientDashboard user={user} store={store} />, appointments: <PatientAppointments user={user} store={store} />, prescriptions: <PatientPrescriptions user={user} store={store} />, profile: <PatientProfile user={user} store={store} /> };
      return map[activeTab] || map.dashboard;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}
