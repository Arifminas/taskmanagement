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
const Chat = require('./models/Chat'); // <-- persist chat
const connectDB = require('./config/db');
const routes = require('./routes');
const departmentController = require('./controllers/departmentController');

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5050',
      'https://frontendtaskmanagement-rose.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }
});

// --- Socket.IO JWT Authentication Middleware ---
io.use(async (socket, next) => {
  try {
    // Prefer auth.token, but also allow header fallback
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) return next(new Error('Authentication error: token required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
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

  // Join personal room for direct notifications if needed
  socket.join(userId);

  // --- Room joins ---
  socket.on('joinPublic', () => {
    socket.join('public');
  });

  socket.on('joinDepartment', (departmentId) => {
    if (!departmentId) return;
    socket.join(`department_${departmentId}`);
  });

  socket.on('leaveDepartment', (departmentId) => {
    if (!departmentId) return;
    socket.leave(`department_${departmentId}`);
  });

  // --- NEW API: Persist + broadcast (public) ---
  // Client emits:  chat:public:send  -> { message }
  // Server emits:  chat:public:new   -> full chat doc (with populated sender)
  socket.on('chat:public:send', async ({ message }, ack) => {
    try {
      const text = (message || '').trim();
      if (!text) return typeof ack === 'function' && ack({ ok: false, error: 'Empty message' });

      const chat = await Chat.create({
        message: text,
        sender: socket.user._id,
        isPublic: true,
        department: null,
      });
      await chat.populate('sender', 'name role');

      io.to('public').emit('chat:public:new', chat);
      if (typeof ack === 'function') ack({ ok: true, data: chat });
    } catch (e) {
      console.error('chat:public:send error:', e);
      if (typeof ack === 'function') ack({ ok: false, error: 'Server error' });
    }
  });

  // --- NEW API: Persist + broadcast (department) ---
  // Client emits:  chat:dept:send -> { departmentId, message }
  // Server emits:  chat:dept:new  -> full chat doc (with populated sender)
  socket.on('chat:dept:send', async ({ departmentId, message }, ack) => {
    try {
      const text = (message || '').trim();
      if (!departmentId || !text) {
        return typeof ack === 'function' && ack({ ok: false, error: 'departmentId & message required' });
      }

      const chat = await Chat.create({
        message: text,
        sender: socket.user._id,
        isPublic: false,
        department: departmentId,
      });
      await chat.populate('sender', 'name role');

      io.to(`department_${departmentId}`).emit('chat:dept:new', chat);
      if (typeof ack === 'function') ack({ ok: true, data: chat });
    } catch (e) {
      console.error('chat:dept:send error:', e);
      if (typeof ack === 'function') ack({ ok: false, error: 'Server error' });
    }
  });

  // --- BACK-COMPAT: Your older event names (persist + old payload) ---
  // publicMessage: string or { text }
  socket.on('publicMessage', async (raw) => {
    try {
      const text = (typeof raw === 'string' ? raw : raw?.text || raw?.message || '').trim();
      if (!text) return;

      const chat = await Chat.create({
        message: text,
        sender: socket.user._id,
        isPublic: true,
        department: null,
      });
      await chat.populate('sender', 'name role');

      // old event payload
      const legacy = {
        user: socket.user.name,
        message: text,
        timestamp: new Date(),
      };
      // emit both: legacy + new (in case new UI listens to modern)
      io.to('public').emit('newPublicMessage', legacy);
      io.to('public').emit('chat:public:new', chat);
    } catch (e) {
      console.error('publicMessage error:', e);
    }
  });

  // departmentMessage: { departmentId, msg }
  socket.on('departmentMessage', async ({ departmentId, msg }) => {
    try {
      const text = (msg || '').trim();
      if (!departmentId || !text) return;

      const chat = await Chat.create({
        message: text,
        sender: socket.user._id,
        isPublic: false,
        department: departmentId,
      });
      await chat.populate('sender', 'name role');

      const legacy = {
        user: socket.user.name,
        message: text,
        timestamp: new Date(),
        departmentId,
      };
      io.to(`department_${departmentId}`).emit('newDepartmentMessage', legacy);
      io.to(`department_${departmentId}`).emit('chat:dept:new', chat);
    } catch (e) {
      console.error('departmentMessage error:', e);
    }
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

// Public depts (as you had)
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
