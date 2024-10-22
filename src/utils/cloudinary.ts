import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { Cloudinary } from '../constants';

cloudinary.config({
    cloud_name: Cloudinary.CLOUD_NAME,
    api_key: Cloudinary.API_KEY,
    api_secret: Cloudinary.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: any) => {
    try {
        if (!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        // console.log("\nfile is uploaded on clodinary", response.url);
        // fs.unlinkSync(localFilePath);
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}
export { uploadOnCloudinary }