require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
  mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const connection = mongoose.connection;

  return new Promise((resolve, reject) => {
    connection.once('open', () => {
      console.log('Database connected');
      resolve();
    });
  }).catch(err => {
    console.log('Connection failed ');
    reject(err);
  });
}

module.exports = connectDB;
