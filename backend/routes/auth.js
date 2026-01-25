import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "smartloansecret"; 

// ROUTE 1: Create a User using: POST "/api/auth/signup"
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // 2. Hashing the password :)
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);

        // 3. Create the user
        user = await User.create({
            name,
            email,
            password: secPassword,
        });

        // 4. Generate Token
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success: true, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Login a User using: POST "/api/auth/login"
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 2. Compare password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 3. Generate Token
        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success: true, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

export default router;