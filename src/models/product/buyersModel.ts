import mongoose, { Document, Schema } from "mongoose";

interface Buyers extends Document {
    productId:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
}

const buyersSchema: Schema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
    },
    {
        timestamps: true,
    }
);


const Buyer = mongoose.model<Buyers>('buyers', buyersSchema);

export { Buyer };