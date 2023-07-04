const GlobalErrorMiddleware = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode || 500).json({
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "production") {
    //If Token is malformed, return meaningful message
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "JSON token malformed. Please login again!",
      });
    }

    if (err.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: `Failed to query for ${err.value}`,
      });
    }

    //If Error is ValidationError - Send A string with validations failed!
    if (err.name === "ValidationError") {
      const str = Object.values(err.errors)
        .map((obj) => obj.message)
        .join(" ");
      return res.status(400).json({
        status: "fail",
        message: `Failed in validation! ${str}`,
      });
    }
    //Duplicate values
    if (err.code === 11000) {
      const values = Object.keys(err.keyPattern);
      return res.status(400).json({
        status: "fail",
        message: `${values.join(", ")} already in use!`,
      });
    }
    //If error is operational,send meaningful message!
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: "fail",
        message: err.message,
      });
    }
    // If password isn't operational,send generic message.
    else
      res.status(500).json({
        status: "error",
        message: "Something went really wrong!",
      });
  }
};

module.exports = GlobalErrorMiddleware;
