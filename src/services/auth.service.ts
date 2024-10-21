import { UserRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";
import { BcryptWrapper } from "../utils/bcrypt-wrapper";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { HttpStatusCodes } from "../utils/http-status-codes";
import { JwtWrapper } from "../utils/jwt-wrapper";
import { Messages } from "../utils/messages";
import { Constants } from "../constants";

export class AuthService {
    public _userRepository: UserRepository;

    constructor(userRepository: UserRepository){
        this._userRepository = userRepository;
    }

    async register(userDetails: any){
        const {fname, lname, email, password, avatarLocalPath} = userDetails;

        if(!avatarLocalPath){
            throw new ApiError(HttpStatusCodes.BAD_REQUEST, Messages.USER.AVATAR_MISSING)
        }

        const userExist = await this._userRepository.findUserByEmail(email);
        if(userExist){
            throw new ApiError(HttpStatusCodes.CONFLICT, Messages.USER.ALREADY_EXISTS);
        }

        const cloudinaryRes = await uploadOnCloudinary(avatarLocalPath);
        let avatar;
        if(cloudinaryRes != null){
            avatar = cloudinaryRes.url;
        }
        const encryptPassword = await BcryptWrapper.hash(password, 10);

        const newUser = await this._userRepository.createUser({fname, lname, email, encryptPassword, avatar});
        
        const responseUser = newUser.toObject() as Record<string, any>;
        delete responseUser.password;
        return responseUser;
    }

    async login(userDetails: any){
        const {email, password} = userDetails;

        const user = await this._userRepository.findUserByEmailWithPassword(email);
        if(!user){
            throw new ApiError(HttpStatusCodes.NOT_FOUND, Messages.USER.INVALID_EMAIL);
        }

        const isPasswordCorrect = await BcryptWrapper.compare(password, user.password);
        if(!isPasswordCorrect){
            throw new ApiError(HttpStatusCodes.UNAUTHORIZED, Messages.USER.INVALID_PASSWORD)
        }

        const payload = {
            id: user._id,
            email: user.email,
        }
        const secretKey = String(Constants.JWT_SECRET);
        const accessToken = JwtWrapper.sign(payload, secretKey, {expiresIn: "1h"})

        const userRes = user.toObject() as Record<string, any>;
        delete userRes.password;

        return {user: userRes, accessToken};
    }

    async getProfile(userDetails: any){
        const {email} = userDetails;
        console.log("email", email)
        const user = await this._userRepository.findUserByEmail(email);
        return user;
    }
}