import AppErrors  from '../utils/appErrors.js';

// for development mode
const sendErrorDev = (err, res) => {
  console.log(err)
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleCastError = (err) => {
  console.log(err);
  const message = `CastError | ${err.errorMessage}}`;
  return new AppErrors(message, err.statusCode);
};
const handleDoubleError = (err) => {
  const message = `DoubleError | Data alredy Exist | ${err.keyValue.name} is alredy set`;
  return new AppErrors(message, err.statusCode);
};
const handleMongooseError = (err) => {
  const errorsName = Object.values(err.errors).map((ele) => ele.path);
  const errorsessage = Object.values(err.errors).map((ele) => ele.message);
  const message = `Invalid input data ${errorsName} | ${errorsessage}`;
  return new AppErrors(message, err.statusCode);
};

const handleJwtError = (err) => {
  return new AppErrors("Invalid token , pleast log in agan", 401);
}
const handleExpierJwtError = (err) => {
  return new AppErrors("Expierd token , pleast log in agan", 401);
}


const sendErrorProd = (err, res) => {
  //for production mode 
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      statusCode : err.statusCode,
      message: err.message,
    });
  } else {
    //1) log Error
    //2) send Error
    console.log(err);
    res.status(500).json({
      status: 'Error',
      message: 'something went worng !!!',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') { 
    sendErrorDev(err, res);
  } 
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'Error') error = handleCastError(error);
    if (error.code === 11000) error = handleDoubleError(error);
    if (err.name === 'ValidationError') error = handleMongooseError(error);
    if (err.name === 'JsonWebTokenError') error = handleJwtError(error);
    if (err.name === 'TokenExpiredError') error = handleExpierJwtError(error);

    sendErrorProd(error, res);
  }
};
