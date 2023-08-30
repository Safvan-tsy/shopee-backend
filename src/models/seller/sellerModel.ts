import mongoose, { Schema, Types } from "mongoose";
import { Sellers } from "@typeStore/seller";


const sellersSchema = new Schema(
    {
        userId:{
            type:Types.ObjectId
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String
        },
        email: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isSeller: {
            type: Boolean,
            default: false
        },
        phone: {
            type: String
        },
        pan: {
            type: String
        },
        displayName: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

const Seller = mongoose.model<Sellers>('sellers', sellersSchema);

export default Seller;