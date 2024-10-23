import { UserRepository } from "../repositories/user.repository";
import { uploadOnCloudinary } from "../utils/cloudinary";

export class UserService {
    _userRepository: UserRepository;

    constructor(userRepository: UserRepository){
        this._userRepository = userRepository;
    }

    async updateAvatar(userDetails: any){
        const { avatarLocalPath, id} = userDetails;
        const response = await uploadOnCloudinary(avatarLocalPath);
        let avatar;
        if(response != null){
            avatar = response.url;
        }

        const updatedUser = await this._userRepository.findByIdAndUpdate(id, {avatar: avatar});
        return updatedUser;
    }
}