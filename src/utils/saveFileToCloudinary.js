import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = (buffer, userId) => {
  return new Promise((resolve, reject) => {
    let settled = false;

    const settleResolve = (result) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    const settleReject = (error) => {
      if (!settled) {
        settled = true;
        reject(error);
      }
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'avatars',
        public_id: String(userId),
        overwrite: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          return settleReject(error);
        }
        settleResolve(result);
      },
    );

    // The stream returned by upload_stream can also emit its own 'error'
    // (e.g. a socket/network failure) that never reaches the callback above.
    // Left unhandled, that would crash the process instead of rejecting
    // this promise, so listen for it explicitly.
    uploadStream.on('error', settleReject);

    uploadStream.end(buffer);
  });
};
