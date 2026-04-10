import ErrorHandler from "../utils/handleError.js";

const errorMiddleware = (err, req, res, next) => {

  if (res.headersSent) {
    return next(err);
  }

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    err = new ErrorHandler("Invalid ID", 400);
  }

  // duplicate key error
  if (err.code === 11000) {
   const message = `This ${Object.keys(err.keyValue)[0]} is already registered. Please login to continue or use another email.`;
    err = new ErrorHandler(message, 400);
  }


  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });

};

export default errorMiddleware;
