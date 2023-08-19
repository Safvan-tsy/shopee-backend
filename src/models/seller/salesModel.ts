import mongoose, { Schema, Types } from "mongoose";
import { Sales } from "../../types/seller";


const salesSchema = new Schema(
    {
        sellerId: {
            type: Types.ObjectId
        },
        productId: {
            type: Types.ObjectId
        },
        quantity: {
            type: Number
        },
        orderId: {
            type: String
        },
        isDeliverd: {
            type: String
        },
        phone: {
            type: String
        },
        pan: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

const Sales = mongoose.model<Sales>('sales', salesSchema);

export default Sales;