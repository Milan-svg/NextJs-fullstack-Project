import mongoose, {Schema, Document, mongo} from "mongoose";


export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema: Schema <Message> = new Schema({
    content:{
        type: String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}
const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "Username required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true, "email required"],
        unique:true,
        match:[ /.+\@.+\..+/, "use a valid email address"]
    },
    password:{
        type:String,
        required:[true, "password is required"]
    },
    verifyCode:{
        type:String,
        required:[true, "Verify Code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true, "Verify Code Expiry is required"]
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;