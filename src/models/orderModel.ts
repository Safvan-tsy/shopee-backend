import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs'

interface Orders extends Document {
    sellerId: mongoose.Types.ObjectId;
    orderItems: mongoose.Types.ObjectId[];
    user: string;
    status:string;
    statusDescription:string;
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
    otp:string;
    correctOtp(candidateOtp: string, userOtp: string): Promise<boolean>;
}

const ordersSchema: Schema = new Schema(
    {
        sellerId: {
            type: mongoose.Types.ObjectId
        },
        orderItems: [mongoose.Schema.Types.ObjectId],
        user: {
            type: String
        },
        status: {
            type: String,
            default:"In progress"
        },
        statusDescription: {
            type: String,
        },
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
            },
            country: {
                type: String
            }
        },
        paymentMethod: {
            type: String,
            required: true
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
            select: false
        },
    }, {
    timestamps: true
}
);

ordersSchema.pre('save', async function (next) {
    if (!this.isModified('otp')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next()
})

ordersSchema.methods.correctOtp = async function (candidateOtp: string, userOtp: string): Promise<boolean> {
    return await bcrypt.compare(candidateOtp, userOtp);
};

const Order = mongoose.model<Orders>("orders", ordersSchema);

export default Order;