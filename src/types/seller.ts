import { Document, Types } from "mongoose";

export interface Sellers extends Document {
    _id:Types.ObjectId;
    userId:Types.ObjectId;
    name: string;
    image: string;
    email: string;
    isAdmin: boolean;
    isSeller:boolean;
    phone: string;
    pan: string;
    displayName: string;
}