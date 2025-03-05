import express from 'express';
import { redis } from './databaseCalls/connections.js'; // Import Redis connection
import axios from 'axios';
import pokemonRoutes from "./routes/pokemonRouteHandle.js";
import unsplashRoute from './routes/unsplashRouteHandle.js';  // Import Unsplash API routes
import cookieParser from 'cookie-parser';
import createTokenRoute  from './routes/createTokenRouteHandle.js'; 
import dotenv from 'dotenv';
dotenv.config({ path: './process.env' });
import cors from'cors';

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());  // To handle cookies for JWT

app.use("/pokemon", pokemonRoutes);

// Mount Unsplash API routes
app.use('/imagesearch', unsplashRoute);

// Route to create a user and generate a JWT
app.use('/createToken', createTokenRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
