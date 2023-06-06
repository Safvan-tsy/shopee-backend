import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
const app = require('./src/app');

const DB = process.env.MONGODB_URI;
mongoose.connect(DB, {
  dbName: process.env.DB_NAME,
}).then(() => console.log("DB Connection Success"))


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});