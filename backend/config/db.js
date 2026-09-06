const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('Starting MongoMemoryServer (Fast version 4.4.18)...');
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'clearcampus',
        },
        binary: {
          version: '4.4.18',
        },
      });
      mongoUri = mongoServer.getUri();
      console.log(`In-memory MongoDB started at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If specific version failed, fallback to default MongoMemoryServer
    try {
      console.log('Fallback: Starting default MongoMemoryServer...');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`Fallback In-memory MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (memError) {
      console.error(`Fallback Memory Mongo Error: ${memError.message}`);
    }
  }
};

module.exports = connectDB;
