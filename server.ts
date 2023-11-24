import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './src/app'
import { v2 as cloudinary } from 'cloudinary'

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
})

dotenv.config({ path: './.env' });

cloudinary.config({
  cloud_name: "safvan",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const port: number = Number(process.env.PORT) || 4000;
const DB: string = process.env.MONGODB_URI;

mongoose.connect(DB, {
  dbName: process.env.DB_NAME,
}).then(() => {
  app.listen(port, () => {
    console.log("listening for requests");
  })
})


// process.on('unhandledRejection', (err:any) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err);
//   server.close(() => {
//     process.exit(1);
//   });
// })