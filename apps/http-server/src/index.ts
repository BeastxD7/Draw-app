import express from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateUserSchema, SigninSchema ,CreateRoomSchema} from '@repo/common/types';
import { middleware } from './middleware';

const app = express();
const PORT =3001;
app.use(express());

app.post('/signup',(req ,res ) => {
    try {
        //@ts-ignore  variables unused!
        const {username , email , password} = CreateUserSchema.safeParse(req.body);

        //db call if email doesn't exists
        //hash the password using bcrypt
        //insert into db

        res.status(200).json({
            message:"user created succcesful."
        })
    } catch (error) {
        res.status(500).json({
            message:"error creating user."
        })
    }
})

app.post('/signin',(req ,res ) => {
    try {
        //@ts-ignore  variables unused!
        const { email , password} = SigninSchema.safeParse(req.body);
        
        //db call if email doesn't exists
        //see if password matches

        const userId = 1;

        const token = jwt.sign ({userId}, JWT_SECRET);

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

app.post('/room',middleware,(req ,res ) => {
    try {

        const data = CreateRoomSchema.safeParse(req.body)

        if(!data.success){
            res.status(422).json({
                message:"invalid inputs"
            })
            return;
        }
        
        const roomId = 123;
        res.status(200).json({
            roomId
        })
    } catch (error) {
        res.status(500).json({
            message:"error creating room"
        })
    }
})

app.listen(PORT , () => {
    console.log(`Http server running in port: ${PORT}`);
    
})