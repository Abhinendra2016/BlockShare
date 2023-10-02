require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
  // Set the strictQuery option before connecting to MongoDB
  mongoose.set('strictQuery', true);

  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const connection = mongoose.connection;

  try {
    return await new Promise((resolve, reject) => {
      connection.once('open', () => {
        console.log('Database connected');
        resolve();
      });
    });
  } catch (err) {
    console.log('Connection failed');
    reject(err);
  }
}

module.exports = connectDB;
