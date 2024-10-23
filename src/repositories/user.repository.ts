import { UserModel } from "../models/user.model";

export class UserRepository {
    
    async createUser(userDetails: any){
        const {fname, lname, email, encryptPassword, avatar} = userDetails;
        const newUser = new UserModel({
            fname,
            lname,
            email,
            password: encryptPassword,
            avatar
        })
        return await newUser.save();
    }

    async findUserByEmail(email: string){
        const user = await UserModel.findOne({ email });
        return user;
    }

    // login route specific
    async findUserByEmailWithPassword(email: string){
        const user = await UserModel.findOne({email}).select("+password");
        return user;
    }

    async findByIdAndUpdate(id: string, query: any){
        const updatedUser = await UserModel.findByIdAndUpdate(id, query);
        return updatedUser;
    }
}