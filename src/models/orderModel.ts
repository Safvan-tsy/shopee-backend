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
            product: mongoose.Types.ObjectId
        }
    ];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string
    };
    paymentMethod: string;
    paymentResult: {
        id: string;
        status: string;
        updateTime: string;
        email: string
    };
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: Date;
    isDelivered: boolean;
    deliveredAt: Date;
    otp: string;
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
                }
            }
        ],
        shippingAddress: {
            address: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            postalCode: {
                type: String,
                required: true
            },
            country: {
                type: String
            }
        },
        paymentMethod: {
            type: String,
        },
        paymentResult: {
            id: {
                type: String
            },
            status: {
                type: String
            },
            updateTime: {
                type: String
            },
            email: {
                type: String
            }
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
        },
        otp: {
            type: String,
            select:false
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