import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDM from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const app = express();
const PORT = process.env.GATE;
// CORS configuration to allow 'token' header
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'token', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

app.get("/", (req, res) => {
    res.send("hello");
})

// Connect to MongoDB first, then start the server
connectDM().then(() => {
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
});
//console.log(process.env.JWT_SECRET)