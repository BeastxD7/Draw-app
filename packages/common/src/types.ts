import {string, z} from "zod";

export const CreateUserSchema = z.object({
    username:z.string().min(3).max(20),
    email:z.string().email(),
    password:z.string(),
    photo:z.optional(z.string())
})

export const SigninSchema = z.object({
    email:z.string().email(),
    password:z.string()
})

export const CreateRoomSchema = z.object({
    name:z.string().min(3).max(20),
})