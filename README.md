# 🎨 Keeper — Frontend

> The client-side of Keep, a production-ready note-taking application. Built with React 19 and TypeScript, featuring a beautiful masonry layout, real-time updates, multi-language support, and a fully responsive design.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| UI Library | Material UI (MUI) |
| Styling | TailwindCSS |
| Real-time | Socket.io Client |
| Internationalization | i18next |
| Error Tracking | Sentry |

---

## ✨ Features

### 🔐 Authentication Pages
- Login with multiple auth methods (Email, Google, GitHub)
- Signup with email verification flow
- Forgot password & reset flow
- MFA / 2FA setup and verification

### 📒 Note Pages
- **Home** — all notes in a masonry grid layout
- **Archive** — archived notes
- **Bin** — soft-deleted notes (trash)
- **Reminders** — notes with upcoming reminders

### ⚙️ Settings Pages
- Personal Info
- Security (MFA, 2FA, Passkey, Password Reset)
- API Keys management
- Subscription management
- User Preferences
- Theme (Dark / Light)
- Delete Account
- Logout

### 🧩 Components
- Masonry note card grid
- Note editor modal
- Label editor modal
- Subscription modal
- Sidebar navigation & top navbar
- Language switcher
- Live chat
- Toast notifications & tooltips

### 🌟 Other
- Dark / Light theme toggle
- Multi-language support (i18next)
- Real-time note updates via Socket.io
- Inactivity-based auto-logout
- Sentry error tracking
- Fully responsive design

---

## 🗂️ Project Structure

```
keep-frontend/
├── src/
│   ├── pages/            # Route-level page components
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API call functions
│   ├── locales/          # i18n translation files
│   └── utils/            # Helpers & utilities
├── .env.example
├── index.html
├── vite.config.ts
├── package.json
└── ...
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Keep backend running (see [keep-backend](../keep-backend/README.md))

### Installation

```bash
cd keep-frontend
npm install
cp .env.example .env
npm run dev
```

### Environment Variables

```env
# API
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# Error Tracking
VITE_SENTRY_DSN=

# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=

# OAuth (if handling redirect URLs on frontend)
VITE_GOOGLE_CLIENT_ID=
VITE_GITHUB_CLIENT_ID=
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Output is generated in the `dist/` folder, ready to be served as a static site.

---

