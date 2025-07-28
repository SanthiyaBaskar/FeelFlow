# Daily Mood Tracker - Frontend Client

React frontend application for the Daily Mood Tracker.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Features

### Pages
- **Login/Register** - User authentication
- **Dashboard** - Daily mood logging with recent entries
- **History** - All mood entries with pagination
- **Analytics** - 7-day mood visualization with charts

### Components
- **Header** - Navigation and user info
- **MoodSelector** - Interactive mood selection
- **MoodEntry** - Individual mood entry display/edit
- **ProtectedRoute** - Authentication wrapper

### State Management
- **AuthContext** - User authentication state
- **Local Storage** - Persistent login sessions

## Styling

The app uses custom CSS with:
- Responsive grid layouts
- Modern glassmorphism design
- Smooth animations and transitions
- Mobile-first responsive design

## API Integration

All API calls are handled through the `services/api.js` file using Axios with automatic JWT token handling and error management.