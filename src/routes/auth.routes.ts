import express from 'express'
import { UserRepository } from '../repositories/user.repository'
import { AuthService } from '../services/auth.service'
import { AuthController } from '../controllers/auth.controller'
import { upload } from '../middlewares/multer.middleware';
import { validate } from '../middlewares/joi-validator.middleware';
import { registerSchema, loginSchema } from '../validations/index';
import { verifyJWT } from '../middlewares/auth.middleware';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const router = express.Router()

router.route('/register').post(upload.fields([{ name: 'avatar', maxCount: 1 }]), validate(registerSchema),  authController.register.bind(authController));

router.route('/login').post(validate(loginSchema), authController.login.bind(authController));
// protected route
router.route('/profile').get(verifyJWT, authController.getProfile.bind(authController))


export default router;