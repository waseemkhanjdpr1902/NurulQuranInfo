# NurulQuran - Modern Islamic Spiritual Platform

NurulQuran is a production-ready Islamic web application dedicated to Quran study, authentic Islamic tools, Islamic science, and ethical finance education. Built with Next.js 15, Firebase Authentication, Razorpay donations, and Gemini AI.

## 🚀 Features

- **Quran Reader**: High-quality audio recitation, verse-by-verse playback, and multi-reciter selection.
- **AI Spiritual Guide**: Advanced AI-powered Tafseer and spiritual assistance using Google Gemini.
- **Hadith Library**: Searchable authentic traditions from major collections.
- **Arabic Academy**: Structured courses for learning Quranic Arabic.
- **Halal Stocks**: Shariah-compliance screening for ethical investing.
- **User Dashboard**: Personalized experience with bookmarks, progress tracking, and activity logs.
- **Secure Auth**: Firebase Authentication with email/password and Google login.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js App Router API routes and Firebase Authentication.
- **AI**: Google Gemini Pro (via @google/genai).
- **Payments**: Razorpay donation support with external fallback links.

## 📂 Folder Structure

```
/nurul-quran
├── /public          # Static assets (images, icons, audio)
├── /src
│   ├── /app         # Next.js App Router (Pages & API Routes)
│   ├── /components  # Modular UI Components
│   ├── /contexts    # Shared client contexts, including Firebase auth
│   ├── /lib         # App utilities, Firebase config, and finance helpers
│   ├── /hooks       # Custom React Hooks
│   ├── /utils       # Utility functions
│   └── /styles      # Global styles
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
- **Firebase**: Create a Firebase project and enable Email/Password and Google Authentication.
- **Gemini API**: Get your key at [aistudio.google.com](https://aistudio.google.com).
- **Razorpay**: Get your keys at [razorpay.com](https://razorpay.com).

### 4. Run Development Server
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
