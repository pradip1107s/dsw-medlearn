# 🌿 DSW Med-Learn — Homeopathy Education Platform

> India's #1 Homeopathy Ed-Tech Platform — AI study assistant, digital library, MCQ engine, Kent repertory & more for BHMS students.

**By Dr. Sagathiya Wellness**

---

## 🚀 Features

### 🧠 AI Study Assistant
Ask any homeopathy question — get answers with book references from Kent, Boericke & Hahnemann. Built-in remedy database with instant AI-powered responses.

### 📚 Digital Library (12 Sections)
Complete homeopathic knowledge base with global search, bookmarks & highlights:

| Section | Description |
|---------|-------------|
| 📖 Organon of Medicine | Hahnemann's aphorisms with simplified explanations & commentary |
| 🧪 Materia Medica | Complete remedy library — Boericke, Kent & Hahnemann |
| 🔍 Repertory | Kent's Repertory with rubric search & remedy grades |
| 🔬 Chronic Diseases | Miasmatic theory — Psora, Sycosis, Syphilis |
| 🧠 Philosophy | Vital force, susceptibility, similia principle |
| 💊 Therapeutics | Disease-wise therapeutic references & remedy selection |
| 🩺 Clinical Cases | Solved cases with rubrics, remedies & follow-up |
| 📋 Disease Templates | Structured templates for common diseases |
| 🔗 Remedy Relationships | Complementary, antidotes, inimicals & follows-well |
| 🦠 Miasm Library | Detailed notes on Psora, Sycosis, Syphilis & Tubercular |
| 📝 BHMS Notes | Subject-wise academic notes for BHMS curriculum |
| ❓ Question Bank | MCQs, viva questions & university exam papers |

### 🧪 MCQ Exam Engine
500+ questions with timer, auto-scoring, weak topic detection and performance analytics.

### 🔍 Therapeutic Search
Search by disease, symptom or remedy. Instant results with book references.

### 🩺 Case Taking System
Digital case sheets with patient info, symptoms, miasm analysis and remedy suggestions.

### 🔐 Authentication & Admin
- Student login/signup with role-based access (Student / Premium / Admin)
- Full admin dashboard with user management, content management & analytics

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Prisma ORM** | Database models & queries |
| **SQLite** | Lightweight embedded database |
| **NextAuth.js** | Authentication with JWT strategy |
| **bcryptjs** | Password hashing |
| **Tailwind CSS 4** | Utility-first styling |

---

## 📁 Project Structure

```
dsw-medlearn/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Seed data script
├── public/
│   └── logo.png               # DSW Med-Learn logo
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts
│   │   ├── page.tsx           # Main landing page
│   │   ├── globals.css        # Global styles
│   │   ├── library/
│   │   │   └── page.tsx       # Digital Library page
│   │   └── api/
│   │       ├── auth/          # Authentication APIs
│   │       │   ├── login/     # POST /api/auth/login
│   │       │   ├── signup/    # POST /api/auth/signup
│   │       │   ├── admin/     # POST /api/auth/admin
│   │       │   ├── me/        # GET /api/auth/me
│   │       │   └── seed/      # POST /api/auth/seed
│   │       └── library/       # Digital Library APIs
│   │           ├── route.ts   # GET sections, search, section data
│   │           ├── item/      # GET single item detail
│   │           └── seed/      # POST seed library data
│   └── lib/
│       └── db.ts              # Prisma client singleton
├── next.config.ts
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/pradip1107s/dsw-medlearn.git
cd dsw-medlearn
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set up the database
```bash
npx prisma db push
npx prisma generate
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Seed the database
The database is auto-seeded on first visit. You can also manually seed:
```bash
# Auth seed (creates admin user)
curl -X POST http://localhost:3000/api/auth/seed

# Library seed (creates sections, books, remedies, etc.)
curl -X POST http://localhost:3000/api/library/seed
```

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dsw.com | admin@123 |

---

## 🗄️ Database Models

```
User              → Student/Premium/Admin accounts
LibrarySection    → 12 digital library sections
Book              → Books within sections
Chapter           → Chapters within books
Aphorism          → Organon aphorisms with explanations
Remedy            → Full remedy profiles (10 remedies)
Rubric            → Repertory rubrics with grades
ClinicalCase      → Solved clinical cases
DiseaseTemplate   → Disease templates with Q&A
Therapeutic       → Disease-wise therapeutics
MiasmNote         → Miasm library entries
BHMSNote          → Academic notes
QuestionBank      → MCQs, viva & exam questions
Bookmark          → User bookmarks
UserNote          → User personal notes
```

---

## 🎨 Design System

The platform uses a **dark forest/nature** theme:

| Variable | Color | Usage |
|----------|-------|-------|
| `--forest` | `#0d2b1f` | Primary background |
| `--sage` | `#1a4d35` | Secondary background |
| `--emerald` | `#3aaa7a` | Primary accent / links |
| `--gold` | `#d4a843` | Premium accent / highlights |
| `--cream` | `#f5f0e8` | Text color |
| `--muted` | `#6b7b6e` | Muted text |

**Fonts:** Playfair Display (headings), DM Sans (body), JetBrains Mono (code/tags)

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email & password |
| POST | `/api/auth/signup` | Register new student |
| POST | `/api/auth/admin` | Admin login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/seed` | Seed admin user |

### Digital Library
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/library` | Get all sections |
| GET | `/api/library?section=materia-medica` | Get section data |
| GET | `/api/library?search=nux` | Global search |
| GET | `/api/library/item?type=remedy&id=xxx` | Get single item |
| POST | `/api/library/seed` | Seed library data |

---

## 📦 Seeded Data Summary

| Data Type | Count |
|-----------|-------|
| Library Sections | 12 |
| Remedies | 10 |
| Aphorisms | 7 |
| Rubrics | 11 |
| Books | 9 |
| Chapters | 6 |
| Therapeutics | 6 |
| Clinical Cases | 3 |
| Disease Templates | 3 |
| Miasm Notes | 4 |
| BHMS Notes | 6 |
| Question Bank | 8 |

---

## 🏗️ Build for Production

```bash
npx next build
npx next start
```

---

## 📄 License

© 2025 Dr. Sagathiya Wellness. All rights reserved.

---

<p align="center">
  <strong>DSW Med-Learn</strong> — Built with ❤️ for BHMS Students
</p>
