import mongoose, { Document, Schema } from "mongoose";

interface Orders extends Document {
    user: mongoose.Types.ObjectId;
    orderItem: {
        name: string;
        qty: number;
        image: string;
        price: number;
        product: mongoose.Types.ObjectId;
        sellerId: mongoose.Types.ObjectId;
    };
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
}

const ordersSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId
        },
        orderItem: {
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
            sellerId: {
                type: mongoose.Types.ObjectId
            }
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
                required: true
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
        }
    }, {
    timestamps: true
}
);

const Order = mongoose.model<Orders>("orders", ordersSchema);

export default Order;