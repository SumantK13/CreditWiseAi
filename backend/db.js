import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Creditwise"
        });

        console.log("MongoDB Connected!");
        console.log("DB Name:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);

    } catch (err) {
        console.log("Mongodb connection failed", err);
        process.exit(1);
    }
};

export default connectDB;