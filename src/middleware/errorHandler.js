import { isHttpError } from 'http-errors';
import { MulterError } from 'multer';

export const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  if (err instanceof MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: err.message,
  });
};
