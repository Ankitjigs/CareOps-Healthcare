# CareOps Healthcare

A B2B healthcare SaaS platform built with React 19 and TypeScript. Features clinical operations management, patient records, analytics dashboards, and real-time notifications.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion
- **State**: Zustand
- **Auth**: Firebase Authentication
- **Notifications**: Service Worker + Context API
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## Getting Started

```bash
npm install
npm run dev
```

## Firebase Setup

1. Copy `.env.example` to `.env`
2. Add your Firebase web app credentials

## Features

- **Authentication**: Firebase-backed login
- **Dashboard**: Clinical operations overview with metrics
- **Analytics**: Charts and data visualization
- **Patients**: Grid and list view toggle, risk assessment badges
- **Notifications**: Service worker-powered push notifications

## Available Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |