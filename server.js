require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const initializeDatabase = require('./src/config/initDb');

// Set port
const PORT = process.env.PORT || 5000;

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
  });