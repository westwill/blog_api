import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import UserRoute from './routes/userRoutes.js';
import PostRoute from './routes/postRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(cookieParser());
const port = process.env.PORT;
const db = process.env.DATABASE_URL;

app.get('/', (req, res) => {
  res.send('Hello Ibiere');
});

// Our other routes in the server===
app.use('/user', UserRoute);
app.use('/post', PostRoute);

// Connecting the database to the server===
mongoose
  .connect(db)
  .then(() => {
    console.log('The database is connected successfully');
    // Server===
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(() => {
    console.log('The database not connected');
  });
