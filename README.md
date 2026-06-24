# Smart Train

Smart Train is a full-stack railway operations and alert system built with a React + Tailwind CSS frontend and a Node.js + Express backend.

## Repository Structure

- `backend/`
  - Node.js server
  - Express API routes
  - Database, authentication, and notification logic

- `train-pulse-alert-system-main/`
  - Vite + React frontend application
  - Tailwind CSS UI
  - Pages for booking, tracking, admin panel, notifications, and user profile

- `extracted_temp/`
  - Temporary extraction artifacts
  - Excluded from the repository via `.gitignore`

## Setup Instructions

### Backend

1. Open `backend/`
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Add a `.env` file with your configuration values.
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open `train-pulse-alert-system-main/`
2. Install dependencies:
   ```bash
   cd train-pulse-alert-system-main
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Notes

- The root `package-lock.json` is intentionally ignored and not tracked in this repository.
- The primary frontend app lives in `train-pulse-alert-system-main/`.
- Confirm backend environment variables (`.env`) before running.

## Contact

For questions or updates, use the repository owner’s GitHub profile.
