# Mini Chatbot

A real-time chat application built with NestJS (backend) and Next.js (frontend).

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: NestJS, Node.js
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

```bash
# Run backend (development mode)
cd backend
npm run start:dev

# Run frontend (development mode)
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend will be available at `http://localhost:3001`

## Project Structure

```
mini-chatbot/
├── backend/           # NestJS application
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── frontend/          # Next.js application
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   └── globals.css
    ├── public/
    └── package.json
```

## Features

- Real-time messaging between users
- Modern UI with dark mode support
- Responsive design

## License

Private
