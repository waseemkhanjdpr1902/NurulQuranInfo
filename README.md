# NurulQuran - Modern Islamic Spiritual Platform

NurulQuran is a production-ready, full-stack application dedicated to the preservation, study, and contemplation of the Holy Quran and Islamic sciences. Built with Next.js 15, Supabase, and Gemini AI.

## 🚀 Features

- **Quran Reader**: High-quality audio recitation, verse-by-verse playback, and multi-reciter selection.
- **AI Study Guide**: Guardrailed educational reflections using Google Gemini, clearly separated from formal tafsir and fatwa.
- **Hadith Library**: Searchable authentic traditions from major collections.
- **Reflection Planner**: Private tadabbur notes, practical actions, and export tools.
- **Islamic Tools**: Prayer times, duas, tasbih, zakat, Names of Allah, and topic-based Qur’an study.
- **User Dashboard**: Personalized experience with bookmarks, progress tracking, and activity logs.
- **Authentication**: Email and configured social sign-in through Supabase.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Supabase (Auth, PostgreSQL, Real-time).
- **AI**: Configurable Google Gemini model through `GEMINI_MODEL`.
- **Payments**: Razorpay (Subscription model).

## 📂 Folder Structure

```
/nurul-quran
├── /public          # Static assets (images, icons, audio)
├── /src
│   ├── /app         # Next.js App Router (Pages & API Routes)
│   ├── /components  # Modular UI Components
│   ├── /services    # API & Backend Services (Supabase, Gemini)
│   ├── /hooks       # Custom React Hooks
│   ├── /utils       # Utility functions
│   └── /styles      # Global styles
├── schema.sql       # Database schema for Supabase
├── .env.example     # Environment variables template
└── package.json     # Dependencies and scripts
```

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nurul-quran.git
cd nurul-quran
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
- **Supabase**: Create a project at [supabase.com](https://supabase.com).
- **Gemini API**: Get your key at [aistudio.google.com](https://aistudio.google.com).
- **Razorpay**: Get your keys at [razorpay.com](https://razorpay.com).

### 4. Database Setup
Run the contents of `schema.sql` in your Supabase SQL Editor to create the required tables and RLS policies.

### 5. Run Development Server
```bash
npm run dev
```

## 🚢 Deployment

### Vercel / Netlify
1. Connect your GitHub repository.
2. Add the environment variables from your `.env` file.
3. Deploy!

### GitHub Pages
Note: This is a Next.js App Router project. For static export to GitHub Pages, you must update `next.config.js` with `output: 'export'`. However, dynamic features (Auth, AI) require a server-side environment like Vercel.

## 📄 License
This project is licensed under the MIT License.

---
Built with ❤️ for the Ummah by Mohammed Waseem & Nurul Quran Team.
