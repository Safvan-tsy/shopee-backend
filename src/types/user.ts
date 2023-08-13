import { Request } from "express";
import { Types } from "mongoose";

export interface Users extends Document {
    _id:Types.ObjectId;
    name: string;
    image: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isSeller:boolean;
    correctPasswords(candidatePassword: string, userPassword: string): Promise<boolean>;
}

export interface AuthenticatedRequest extends Request {
    user?: Users; 
}