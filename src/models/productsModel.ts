import mongoose, { Document, Schema } from "mongoose";

interface Products extends Document {
    name: string;
    image: string;
    brand: string;
    category: string;
    description: string;
    reviews: mongoose.Types.ObjectId[];
    rating: number;
    numReviews: number;
    price: number;
    countInStock: number;
    user: mongoose.Types.ObjectId[];
}

interface Reviews extends Document {
    name: string;
    comment: string;
    rating: number;
    user: mongoose.Types.ObjectId[];
}

const productsSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        brand: {
            type: String,
        },
        category: {
            type: String,
        },
        description: {
            type: String,
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            default: 0,
        },
        countInStock: {
            type: Number,
            default: 0,
        },
        user: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps:true,
    }
);

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
        user:{
                type: Schema.Types.ObjectId,
                ref: "User",
       },
    },
    {
        timestamps:true,
    }
);

const Product = mongoose.model<Products>('products', productsSchema);
const Review = mongoose.model<Reviews>('reviews', reviewsSchema);

export { Product, Review};