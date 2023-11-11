import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs'

export interface Orders extends Document {
    userId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    status: string;
    statusDescription: string;
    orderItems: [
        {
            name: string;
            qty: number;
            image: string;
            price: number;
            product: mongoose.Types.ObjectId,
            itemsPrice: number;
            taxPrice: number;
            shippingPrice: number;
            totalPrice: number;
        }
    ];
    cartTotal: number;
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        state: string;
        country: string
    };
    paymentMethod?: string;
    isPaid?: boolean;
    paidAt?: Date;
    isDelivered?: boolean;
    deliveredAt?: Date;
}

const ordersSchema: Schema = new Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId
        },
        sellerId: {
            type: mongoose.Types.ObjectId
        },
        status: {
            type: String
        },
        statusDescription: {
            type: String
        },
        orderItems: [
            {
                name: {
                    type: String
                },
                qty: {
                    type: Number
                },
                image: {
                    type: String
                },
                price: {
                    type: Number
                },
                product: {
                    type: mongoose.Types.ObjectId
                },
                itemsPrice: {
                    type: Number,
                    default: 0.0
                },
                taxPrice: {
                    type: Number,
                    default: 0.0
                },
                shippingPrice: {
                    type: Number,
                    default: 0.0
                },
                totalPrice: {
                    type: Number,
                    default: 0.0
                },
            }
        ],
        cartTotal: {
            type: Number
        },
        shippingAddress: {
            address: {
                type: String,
            },
            city: {
                type: String,
            },
            postalCode: {
                type: String,
            },
            state: {
                type: String
            },
            country: {
                type: String
            }
        },
        paymentMethod: {
            type: String,
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        paidAt: {
            type: Date
        },
        isDelivered: {
            type: Boolean,
            default: false
        },
        deliveredAt: {
            type: Date
        }
    }, {
    timestamps: true
}
);

// ordersSchema.pre('save', async function (next) {
//     if (!this.isModified('otp')) return next();
//     this.otp = await bcrypt.hash(this.otp, 12);
//     next()
// })

// ordersSchema.methods.correctOtp = async function (candidateOtp: string, userOtp: string): Promise<boolean> {
//     return await bcrypt.compare(candidateOtp, userOtp);
// };

const Order = mongoose.model<Orders>("orders", ordersSchema);

export default Order;