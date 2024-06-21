import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import UserRoute from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;
const db = process.env.DATABASE_URL;

app.get('/', (req, res) => {
  res.send('Hello Ibiere');
});

// Our other routes in the server===
app.use('/user', UserRoute);

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
