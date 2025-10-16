# Timo - Pomodoro Timer & Mood Tracker

A comprehensive productivity app with Pomodoro timer, mood tracking, and task management features, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Pomodoro Timer**: 25-minute work sessions with break tracking
- **Mood Tracker**: Daily mood logging with 7-day analytics
- **Task Management**: Create and manage daily tasks
- **Dashboard**: Overview of daily progress
- **Persian Calendar**: Jalali date support
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: Vanilla JavaScript, Bootstrap
- **Calendar**: Jalali Moment.js
- **Deployment**: Docker, Back4App, Liara

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/alipejman/timo.git
cd timo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# MongoDB Atlas Configuration
MONGODB_URI=YOUR_MONGODB_URI

# Server Configuration
PORT=3000
```

### 4. Run the application
```bash
npm start
```

Visit `http://localhost:3000` to see the app.

## 🗄️ Database Models

### Timer
- `sessionType`: work, break, longBreak
- `duration`: seconds
- `date`: Persian date string
- `completedAt`: timestamp

### Mood
- `date`: Persian date string
- `mood`: very-sad, sad, neutral, happy, very-happy
- `note`: optional note
- `energy`: 1-10 scale
- `sleep`: hours and quality

### Checklist
- `date`: Persian date string
- `items`: array of tasks with completion status

## 🔌 API Endpoints

### Timer
- `GET /api/timer?date=YYYY/MM/DD` - Get daily timer stats
- `POST /api/timer/addSeconds` - Add seconds to timer
- `GET /api/timer/range?from=YYYY/MM/DD&to=YYYY/MM/DD` - Get timer range

### Mood
- `GET /api/mood?date=YYYY/MM/DD` - Get daily mood
- `POST /api/mood/save` - Save mood entry
- `GET /api/mood/range?from=YYYY/MM/DD&to=YYYY/MM/DD` - Get mood range

### Checklist
- `GET /api/checklist?date=YYYY/MM/DD` - Get daily checklist
- `POST /api/checklist/save` - Save checklist
- `PUT /api/checklist/item/:id` - Update checklist item

## 🚀 Deployment

### Back4App
1. Create a new app in Back4App
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: production
   - `PORT`: 3000

### Liara
1. Create a new project in Liara
2. Connect your GitHub repository
3. The `liara.json` file will be automatically detected

## 📱 Usage

1. **Timer**: Start a 25-minute Pomodoro session
2. **Mood**: Log your daily mood and energy level
3. **Tasks**: Create and manage daily tasks
4. **Dashboard**: View your daily progress

## 🔧 Development

### Project Structure
```
timo/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Task.js             # Task model
│   ├── Timer.js            # Timer model
│   ├── Checklist.js        # Checklist model
│   └── Mood.js             # Mood model
├── routes/
│   └── api.js              # API routes
├── public/
│   ├── index.html          # Dashboard
│   ├── pomodoro.html       # Timer page
│   ├── mood.html           # Mood tracker
│   └── checklist.html      # Task manager
├── server.js               # Main server file
├── package.json            # Dependencies
├── Dockerfile              # Docker configuration
├── liara.json              # Liara deployment config
└── .env                    # Environment variables
```

### Adding New Features
1. Create model in `models/` directory
2. Add routes in `routes/api.js`
3. Update frontend in `public/` directory
4. Test locally with `npm start`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email [alipejman.dev@gmail.com](mailto:alipejman.dev@gmail.com) or create an issue on GitHub.
