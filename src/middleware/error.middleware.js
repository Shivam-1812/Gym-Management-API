const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    
    // Determine the status code
    const statusCode = err.statusCode || 500;
    
    // Determine the error message
    const message = err.message || "Something went wrong";
    
    // Send the error response
    res.status(statusCode).json({
      success: false,
      error: {
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  };
  
  module.exports = errorMiddleware;