import mongoose, { Document, Schema } from "mongoose";

interface Users extends Document {
    email:string;
    orders:mongoose.Types.ObjectId[]
}

const usersSchema: Schema = new Schema(
    {
        email:{
            type:String
        },
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'orders' 
        }]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<Users>('users', usersSchema);

export default User