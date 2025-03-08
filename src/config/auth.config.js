module.exports = {
  secret: process.env.JWT_SECRET || "gym-management-secret-key",
  // Token expires in 24 hours
  jwtExpiration: 86400,
  // For refresh tokens
  jwtRefreshExpiration: 604800 // 7 days
};  