# Daily Mood Tracker

A full-stack web application that allows users to track their daily moods with authentication, data visualization, and mood history management.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Daily Mood Logging**: Select from 4 mood options (Happy, Sad, Angry, Okay) with optional notes
- **Mood History**: View all mood entries in reverse chronological order with pagination
- **Analytics Dashboard**: Visualize mood patterns over the past 7 days with interactive charts
- **CRUD Operations**: Create, read, update, and delete mood entries
- **Responsive Design**: Clean, modern UI that works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React** with React Router
- **Chart.js** with react-chartjs-2 for data visualization
- **Axios** for API calls
- **CSS3** with responsive design

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd daily-mood-tracker
```

### 2. Database Setup

1. Create a PostgreSQL database named `mood_tracker`
2. Update the database configuration in `server/.env`

### 3. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mood_tracker
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

Initialize the database tables:

```bash
npm run init-db
```

Start the backend server:

```bash
npm run dev
```

### 4. Frontend Setup

Open a new terminal and navigate to the client directory:

```bash
cd client
npm install
```

Start the React development server:

```bash
npm start
```

## Usage

1. **Access the Application**: Open your browser and go to `http://localhost:3000`

2. **Create Account**: Register with your email and password

3. **Login**: Use your credentials to access the dashboard

4. **Log Daily Mood**: 
   - Select your mood from the 4 options
   - Add an optional note (max 150 characters)
   - Submit to save your mood for the day

5. **View History**: Navigate to the History page to see all your mood entries

6. **Analytics**: Check the Analytics page to see your mood patterns over the past 7 days

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Mood Entries
- `GET /api/moods` - Get user's mood entries (paginated)
- `POST /api/moods` - Create a new mood entry
- `PUT /api/moods/:id` - Update a mood entry
- `DELETE /api/moods/:id` - Delete a mood entry
- `GET /api/moods/analytics` - Get mood analytics for past 7 days

## Project Structure

```
daily-mood-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React context for state management
│   │   ├── pages/          # Main page components
│   │   ├── services/       # API service functions
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route handlers
│   ├── scripts/            # Database scripts
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Make sure PostgreSQL is running and credentials in `.env` are correct
2. **Port Already in Use**: Change the PORT in server `.env` file or stop the process using the port
3. **Module Not Found**: Run `npm install` in both client and server directories
4. **JWT Token Issues**: Clear browser localStorage and login again

### Support

If you encounter any issues, please check the console logs for error messages and ensure all dependencies are properly installed.