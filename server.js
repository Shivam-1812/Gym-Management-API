require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const initializeDatabase = require('./src/config/initDb');

// Set port
const PORT = process.env.PORT || 5000;

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server is running on port ${PORT}. Accessible via: http://192.168.247.133:${PORT}`);
    });
  })
  .catch(err => {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
  });

// Log unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});