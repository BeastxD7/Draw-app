import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateUserSchema, SigninSchema ,CreateRoomSchema} from '@repo/common/types';
import { middleware } from './middleware';
import { prisma } from '@repo/db/prisma-client';

const app = express();
const PORT =3001;
app.use(express.json());

app.post('/signup',async(req ,res ) => {
    try {
        const parsedData = CreateUserSchema.safeParse(req.body);
        
        if(!parsedData.success){
            res.status(422).json({
                message:"invalid inputs",
                parsedData
            })
            return;
        }

        const {username , email , password , photo} = parsedData.data;
        //hash the password using bcrypt
        await prisma.user.create({
            data: {
                name: username,
                email: email,
                password: password,
                photo: photo
            }
        });

        res.status(200).json({
            message:"user created succcesful."
        })

    } catch (error:any) {
        console.log(error);

        if(error.name == "PrismaClientKnownRequestError" && error.meta.target == "email"){
            res.status(409).json({
                message:"email already exists!",
            })
            return;
        }
        
        res.status(500).json({
            message:"error creating user.",
            error
        })
    }
})

app.post('/signin',async (req ,res ) => {
    try {

        const parsedData = SigninSchema.safeParse(req.body);
        
        if(!parsedData.success){
            res.status(422).json({
                message:"invalid inputs",
                parsedData
            })
            return;
        }

        const isUserExists = await prisma.user.findFirst({
            where:{
                email:parsedData.data.email,
                password:parsedData.data.password
            }
        })

        if(!isUserExists) {
            res.status(400).json({
            message:"user doesn't exists or invalid credentials"
        })
        return;
        }        

        const token = jwt.sign ({userId:isUserExists.id}, JWT_SECRET);

        res.status(200).json({
            message:"user signed in succcesful.",
            token
        })
    } catch (error) {
        res.status(500).json({
            message:"error signing in a user."
        })
    } 
})

app.post('/room',middleware,async (req ,res ) => {
    try {

        const parsedData = CreateRoomSchema.safeParse(req.body)

        if(!parsedData.success){
            res.status(422).json({
                message:"invalid inputs"
            })
            return;
        }

        const createdRoom = await prisma.room.create({
            data:{
                slug: parsedData.data.name,
                adminId:req.userId
            }
        })
        
        res.status(200).json({
            roomId:createdRoom.id,
            roomName:createdRoom.slug
        })
    } catch (error:any) {

        
       if(error.name == "PrismaClientKnownRequestError" && error.meta.target == "slug") {
        res.status(409).json({
            message:"Already room Exists!",
        })
        return;
       }

        res.status(500).json({
            message:"error creating room",
            error
        })
    }
})

app.listen(PORT , () => {
    console.log(`Http server running in port: ${PORT}`);
})