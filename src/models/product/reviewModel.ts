import mongoose, { Document, Schema } from "mongoose";

export interface Reviews extends Document {
    productId: mongoose.Types.ObjectId
    sellerId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    name: string;
    comment: string;
    rating: number;
    user?: mongoose.Types.ObjectId[];
}

const reviewsSchema: Schema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "Seller"
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        name: {
            type: String,
        },
        comment: {
            type: String,
        },
        rating: {
            type: Number,
            default: 0,
        },
        user: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);


const Review = mongoose.model<Reviews>('reviews', reviewsSchema);

export { Review };