const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");

let mongoServer;

async function connectDB() {
  try {
    const dbPath = path.resolve(__dirname, "../../mongo-data");

    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbPath: dbPath,
        storageEngine: "wiredTiger",
      },
      binary: {
        version: "7.0.14",
      },
    });

    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    console.log("✅ MongoDB (in-memory) подключена:", uri);
  } catch (err) {
    console.error("❌ Ошибка подключения к MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;