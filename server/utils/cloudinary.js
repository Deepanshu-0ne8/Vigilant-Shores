import { v2 as cloudinary } from 'cloudinary';
import { 
    CLOUDINARY_CLOUD_NAME, 
    CLOUDINARY_API_KEY, 
    CLOUDINARY_API_SECRET 
} from '../config/env.js';

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

/**
 * Uploads a local file to Cloudinary.
 * @param {string} localFilePath - The local path of the file to upload.
 * @returns {Promise<object | null>} - The Cloudinary response object or null on failure.
 */
export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "reports" // Optional: specify a folder
        });

        // File has been uploaded successfully
        // console.log("File is uploaded on cloudinary", response.url);
        return response;

    } catch (error) {
        // You might want to delete the file from the local server after a failed upload
        // fs.unlinkSync(localFilePath); 
        console.error("Cloudinary upload failed:", error);
        return null;
    }
}