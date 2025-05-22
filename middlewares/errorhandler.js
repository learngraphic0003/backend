// errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error("Error occurred:", err);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      ...(err.errors && { errors: err.errors }),
    });
  };
  
  module.exports = errorHandler;
  