import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";
import 
{ CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} from "../services/enviroments.service";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:    CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadBuffer = (buffer: Buffer, folder: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
};

export const deleteFile = (publicId: string): Promise<void> => {
  return cloudinary.uploader.destroy(publicId).then(() => {});
};
