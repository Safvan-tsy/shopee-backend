import mongoose, { Document, Schema } from "mongoose";

interface Users extends Document {
    name: string;
    image: string;
    email: string;
    password: string;
    isAdmin: string;
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



const User = mongoose.model<Users>('users', usersSchema);

export default User