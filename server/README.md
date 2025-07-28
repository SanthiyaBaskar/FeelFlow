# Daily Mood Tracker - Backend Server

Node.js/Express backend API for the Daily Mood Tracker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Initialize database:
```bash
npm run init-db
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Mood Entries (Protected Routes)
- `GET /api/moods` - Get user's mood entries
- `POST /api/moods` - Create mood entry
- `PUT /api/moods/:id` - Update mood entry
- `DELETE /api/moods/:id` - Delete mood entry
- `GET /api/moods/analytics` - Get mood analytics

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Users Table
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE)
- `password` (VARCHAR - hashed)
- `created_at` (TIMESTAMP)

### Mood Entries Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users)
- `mood` (VARCHAR - 'Happy', 'Sad', 'Angry', 'Okay')
- `note` (TEXT - max 150 chars)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run init-db` - Initialize database tables