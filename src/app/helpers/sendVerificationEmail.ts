import {resend} from "@/lib/resend";
import VerificationEmail from "../../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";


export async function sendVerEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{

    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Next feedback app | Verification Code',
            react: VerificationEmail({username, otp: verifyCode})
          });
          return {
            success:true,
            message: "successfully sent verification email"
        }
    } catch (error) {
        console.error("error sending verification email", error)
        return {
            success:false,
            message: "failed to send verification email"
        }
    }
}