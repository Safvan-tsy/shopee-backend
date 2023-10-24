import mongoose, { Document, Schema } from "mongoose";

export interface CartType extends Document {
    userId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    status: string;
    orderItems: [
        {
            name: string;
            qty: number;
            image: string;
            price: number;
            productId: mongoose.Types.ObjectId,
            itemsPrice: number;
            taxPrice: number;
            shippingPrice: number;
            totalPrice: number;
        }
    ];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        state:string;
        country: string
    };
    paymentMethod: string;
    cartTotal: number;
    isPaid: boolean;
    paidAt: Date;
    isDelivered: boolean;
    deliveredAt: Date;
}

const cartsSchema: Schema = new Schema(
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
                productId: {
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
    }, {
    timestamps: true
}
);


const Cart = mongoose.model<CartType>("carts", cartsSchema);

export default Cart;