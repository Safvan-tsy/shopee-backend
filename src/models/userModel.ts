import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs'

interface Users extends Document {
    name: string;
    image: string;
    email: string;
    password: string;
    isAdmin: string;
    correctPasswords(candidatePassword: string, userPassword: string): Promise<boolean>;
}

const usersSchema: Schema = new Schema(
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
            required: true,
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
        }
    },
    {
        timestamps: true,
    }
);

usersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
})

usersSchema.methods.correctPasswords = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<Users>('users', usersSchema);

export default User