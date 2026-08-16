import dotenv from "dotenv";
dotenv.config();

const result = dotenv.config();

console.log("ENV:", result.parsed);
import express from "express";
import connectDB from "./db.js";
import cors from 'cors';
import authRoutes from './routes/auth.js';
import recommendRoutes from './routes/recommend.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

//Routes: 
app.use('/api/auth', authRoutes);
app.use('/api/recommend', recommendRoutes); 

app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
});