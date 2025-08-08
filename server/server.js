// --- Updated server.js with real-time notification support ---
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const connectDB = require('./config/db');
const routes = require('./routes');
const departmentController = require('./controllers/departmentController');
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5050', 'https://frontendtaskmanagement-rose.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// --- Socket.IO JWT Authentication Middleware ---
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: token required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return next(new Error('Authentication error: user not found'));

    socket.user = user;
    next();
  } catch (err) {
    console.error('Socket.IO auth error:', err.message);
    next(new Error('Authentication error'));
  }
});

// --- Unified Socket.IO Connection Handler ---
io.on('connection', (socket) => {
  const userId = socket.user._id.toString();

  console.log(`User connected: ${socket.user.name} (Socket ID: ${socket.id})`);

  // Mark user as online
  User.findByIdAndUpdate(userId, { isOnline: true }).exec();

  // Join personal room
  socket.join(userId);

  // Join department room
  socket.on('joinDepartment', (departmentId) => {
    socket.join(`department_${departmentId}`);
  });

  // Join public chat room
  socket.on('joinPublic', () => {
    socket.join('public');
  });

  // Handle public chat
  socket.on('publicMessage', (msg) => {
    const payload = {
      user: socket.user.name,
      message: msg,
      timestamp: new Date(),
    };
    socket.to('public').emit('newPublicMessage', payload);
  });

  // Handle department chat
  socket.on('departmentMessage', ({ departmentId, msg }) => {
    const payload = {
      user: socket.user.name,
      message: msg,
      timestamp: new Date(),
      departmentId,
    };
    socket.to(`department_${departmentId}`).emit('newDepartmentMessage', payload);
  });

  // On disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.name} (Socket ID: ${socket.id})`);
    User.findByIdAndUpdate(userId, { isOnline: false }).exec();
  });
});

// --- Connect to MongoDB ---
connectDB();

// --- Middlewares ---
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({ checkQuery: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS config
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5050',
  'https://frontendtaskmanagement-rose.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);


app.get('/api/v1/departments/public', departmentController.getAllDepartments);
// --- API routes ---
app.use('/api', routes);

// --- Health check ---
app.get('/', (req, res) => res.send('Task & Asset Management API is running'));

// --- Set Socket.IO instance on app for use in routes/controllers ---
app.set('io', io);
// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ status: 'error', message: 'CORS policy violation' });
  }
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// --- Graceful shutdown ---
process.on('SIGINT', async () => {
  console.log('SIGINT received: closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

// --- Start server ---
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  .on('error', err => console.error('Server error:', err));
