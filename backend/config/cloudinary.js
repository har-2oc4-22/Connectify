import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        })

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })
        
        // Delete local temp file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        
        return uploadResult.secure_url

    } catch (error) {
        // Delete local temp file even on failure
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        console.error("Cloudinary Upload Error:", error.message)
        return null // Explicitly return null so caller knows it failed
    }
}

export default uploadOnCloudinary