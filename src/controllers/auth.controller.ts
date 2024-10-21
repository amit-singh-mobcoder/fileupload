import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { HttpStatusCodes } from "../utils/http-status-codes";
import { ApiResponse } from "../utils/api-response";
import { Messages } from "../utils/messages";

export class AuthController {
    public _authService: AuthService;

    constructor(authService: AuthService){
        this._authService = authService;
    }

    async register(req: Request, res: Response, next: NextFunction){
        try {
            const {fname, lname, email, password} = req.body;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const avatarLocalPath = files.avatar ? files.avatar[0]?.path : undefined;

            const newUser = await this._authService.register({fname, lname, email, password, avatarLocalPath})
            res.status(HttpStatusCodes.CREATED).json(new ApiResponse(HttpStatusCodes.OK, newUser, Messages.USER.USER_CREATED))
            
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction){
        try {
            const {email, password} = req.body;
            const {user, accessToken} = await this._authService.login({email, password});
            res.status(HttpStatusCodes.OK).json(new ApiResponse(HttpStatusCodes.OK, {user, accessToken}, Messages.AUTH.LOGIN_SUCCESS));
        } catch (error) {
            next(error)
        }
    }

    async getProfile(req: Request, res: Response, next: NextFunction){
        try {
            const reqUserObj = req.user;
            const user = await this._authService.getProfile(reqUserObj)
            res.status(200).json(new ApiResponse(HttpStatusCodes.OK, user, Messages.USER.USER_FETCHED))
        } catch (error) {
            next(error);
        }
    }
}