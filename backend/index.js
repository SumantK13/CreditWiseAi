import express from "express";
import 'dotenv/config'
import connectDB from "./db.js";
import cors from 'cors';
import authRoutes from './routes/auth.js'


const app = express();
const PORT = process.env.PORT||5000;

app.use(cors());
app.use(express.json());

connectDB();

//Routes: 
app.use('/api/auth', authRoutes)

// app.get('/', (req, res)=>{
//     res.send("Creditwise API is Running");
// })

app.listen(PORT, ()=>{
    console.log(`Server running on PORT:${PORT}`);
})