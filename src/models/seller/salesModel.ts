import mongoose, { Schema, Types } from "mongoose";
import { Sales } from "@typeStore/seller";


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
            type: Types.ObjectId
        },
        isDeliverd: {
            type: Boolean
        },
        customerData: {
            name: {
                type: String
            },
            email: {
                type: String
            },
            phone: {
                type: String
            }
        },
    },
    {
        timestamps: true,
    }
);

const Sales = mongoose.model<Sales>('sales', salesSchema);

export default Sales;