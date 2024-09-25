import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcrypt"
import { sendVerEmail } from "@/app/helpers/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json(
                {
                    success: false,
                    message: "username already taken"
                },{status:400}
            )
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message: "user already exists"
                },{status:400})
            } else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password= hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) // ayein??
                await existingUserByEmail.save()
            }
        }else{
            // nahi mila toh mtlb user naya hai
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()       // const hai but we can modify cause its an object, were modifying values inside of it
            expiryDate.setHours(expiryDate.getHours() + 1) 

            // user save krlete hai ab

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified:false,
                isAcceptingMessage: true,
                messages:[]
            })
            await newUser.save()
        }
        // here we'll send verification email
        const emailResponse = await sendVerEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message: emailResponse.message
            },{status:500})
        }
        return Response.json({
            success:true,
            message: "user registered successfully, proceed with email verification"
        },{status:201})
    } catch (error) {
        console.error("error while registering the user", error)
        return Response.json(
            {
                success:false,
                message:"error while registering the user"
            },
            {
                status:500
            }
        )
    }
}