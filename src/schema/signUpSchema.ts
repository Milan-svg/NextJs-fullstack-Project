import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(3, "username must be atleast three characters")
    .max(15, "username must be no more than 15 characters")
    .regex(/^[a-zA-Z0-9_]+$/ , "username must not contain special characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email : z.string().email({message: "invalid email"}),
    password: z.string().min(8, {message: "password must be 8 characters"})
})