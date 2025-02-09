import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config";
import { middleware } from './middleware';


const app = express();
app.use(express.json())

app.post("/siginin", (req , res) => {

    try {
        const username = "beast@beast.com";
        const password = "qwerty"

        //TODO: DB call & Zod Validation

        res.status(200).json({
            message:"user signed up succesfully!"
        })

    } catch (error) {
        console.error(error);
        res.status(400).json({
            message:"error while signing up!"
        })
    }
})

app.post("/signup", (req , res) => {

    try {
        const username = "beast@beast.com";
        const password = "qwerty"

        //check if user exists
        //check for password

        const userId:number = 1;
        const token = jwt.sign(userId.toString() , JWT_SECRET)

        res.status(200).json({
            message:"user signed up succesfully!",
            token
        })
        
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message:"error while signing in!"
        })
    }
})

app.post("/room",middleware, (req , res) => {

})


app.listen(3001,()=>{
    console.log(`Running server`);

}) 