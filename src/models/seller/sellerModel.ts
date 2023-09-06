import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import { Sellers } from "@typeStore/seller";


const sellersSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, "please enter password"],
            select: false
        },
        passwordConfirm: {
            type: String,
            validate: {
                validator: function (el: string) {
                    return el === this.password;
                },
                message: 'Passwords are not the same!'
            }
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isSeller: {
            type: Boolean,
            default: false
        },
        phone: {
            type: String
        },
        pan: {
            type: String
        },
        displayName: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

sellersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
})

sellersSchema.methods.correctPasswords = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const Seller = mongoose.model<Sellers>('sellers', sellersSchema);

export default Seller;