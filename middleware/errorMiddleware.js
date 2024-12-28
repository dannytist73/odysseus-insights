// middleware/errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.name || "Error",
    message: err.message || "An unexpected error occurred",
  });
};
