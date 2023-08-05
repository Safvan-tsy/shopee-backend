import mongoose, { Document, Schema } from "mongoose";

interface Reviews extends Document {
    name: string;
    comment: string;
    rating: number;
    user: mongoose.Types.ObjectId[];
}

const reviewsSchema: Schema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
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
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);


const Review = mongoose.model<Reviews>('reviews', reviewsSchema);

export { Review };