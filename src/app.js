const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const agencyRoutes = require('./routes/agency.routes');
const productRoutes = require('./routes/product.routes');
const importRoutes = require('./routes/import.routes');
const exportRoutes = require('./routes/export.routes');
const paymentRoutes = require('./routes/payment.routes');
const distributionRoutes = require('./routes/distribution.routes');
const reportRoutes = require('./routes/report.routes');
const regulationRoutes = require('./routes/regulation.routes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SE347 Agency Management API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/distributions', distributionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/regulations', regulationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại',
  });
});

// Error handler (phải đặt cuối cùng)
app.use(errorHandler);

module.exports = app;
