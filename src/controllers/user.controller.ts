import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { ApiResponse } from "../utils/api-response";
import { HttpStatusCodes } from "../utils/http-status-codes";
import { Messages } from "../utils/messages";

export class UserController {
    _userService: UserService;

    constructor(userService: UserService){
        this._userService = userService;
    }

    async updateAvatar(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.user as {id: string};
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const avatarLocalPath = files.avatar ? files.avatar[0]?.path : undefined;
            const updatedUser = await this._userService.updateAvatar({avatarLocalPath, id});
            res.status(200).json(new ApiResponse(HttpStatusCodes.OK, updatedUser, Messages.USER.AVATAR_UPDATED))
        } catch (error) {
            next(error);
        }
    }
}