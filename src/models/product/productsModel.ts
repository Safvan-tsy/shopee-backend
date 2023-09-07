import mongoose, { Document, Schema } from "mongoose";

interface Products extends Document {
    sellerId:mongoose.Types.ObjectId;
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
}

const productsSchema: Schema = new Schema(
    {
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "Seller"
        },
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
        orderCount: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps:true,
    }
);


const Product = mongoose.model<Products>('products', productsSchema);

export default Product ;