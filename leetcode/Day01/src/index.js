const express= require ('express')
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser= require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit')
const cors = require('cors')

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);
app.use('/problem',problemRouter);
app.use('/submission', submitRouter);

const InitializeConnection = async () => {
    try{
        await Promise.all([main(),redisClient.connect()]);
        console.log('Database and Redis connected successfully');
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port number: ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.error('Database connection failed:', error);
    }
}

InitializeConnection();
