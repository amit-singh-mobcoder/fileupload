import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";
import express from 'express'
import { verifyJWT } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = express.Router();

// protected routes
router.route('/update/avatar').post(verifyJWT, upload.fields([{ name: 'avatar', maxCount: 1 }]) , userController.updateAvatar.bind(userController))

export default router;