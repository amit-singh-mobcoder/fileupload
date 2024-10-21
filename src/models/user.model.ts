import mongoose, {Document, Schema } from "mongoose";

interface IUser extends Document {
    fname: string;
    lname: string;
    email: string;
    password: string;
    avatar: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        fname:{
            type: String,
            required: true,
        },
        lname:{
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        avatar: {
            type: String,
            required: true,
        }

    },
    {timestamps: true}
);


export const UserModel = mongoose.model<IUser>('User', userSchema);