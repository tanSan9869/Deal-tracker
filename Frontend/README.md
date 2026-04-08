# Deal Tracker

A modern Deal Tracking application built with React and Vite. It features a Kanban-style board for managing deals, authentication, and a responsive UI.

## Features

- **Kanban Board:** Drag and drop deals across different stages using `@hello-pangea/dnd`.
- **Authentication:** Secure login and user management (with Firebase & Supabase integration).
- **Responsive UI:** Built with Tailwind CSS and Radix UI primitives.
- **Routing:** Client-side routing with React Router.
- **Docker Support:** Ready for containerized development and deployment.

## Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** Tailwind CSS, clsx, tailwind-merge
- **Icons:** Lucide React
- **Drag & Drop:** `@hello-pangea/dnd`
- **Backend Services:** Firebase, Supabase

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the `Frontend` directory and add your configuration details. E.g.:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here

# Supabase
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Running the Application

To start the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Docker

You can also run the application using Docker setup.

**Development mode:**
```bash
docker build -t deal-tracker-dev -f DockerFile.dev .
docker run -p 5173:5173 deal-tracker-dev
```

**Production mode:**
```bash
docker build -t deal-tracker -f dockerfile .
```
