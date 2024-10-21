import { configDotenv } from "dotenv"
configDotenv()

export const Constants = {
   PORT : Number(process.env.PORT) || 8000,
   DB_NAME: "fileupload",
   DB_URI:  process.env.MONGODB_URI,
   JWT_SECRET: process.env.JWT_SECRET,
}

export const Cloudinary = {
   CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
   API_KEY: process.env.CLOUDINARY_API_KEY,
   API_SECRET: process.env.CLOUDINARY_API_SECRET  
}