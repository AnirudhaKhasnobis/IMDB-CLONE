import app from "./server.js";
import mongodb from "mongodb";
import ReviewsDAO from "./dao/reviewsDAO.js";
import dotenv from "dotenv";

dotenv.config();

const MongoClient = mongodb.MongoClient;
const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const uri = `mongodb+srv://${username}:${password}@cluster0.axnck.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Add this to debug connection issues
console.log('Attempting to connect to MongoDB...');

const port = 8000;

MongoClient.connect(
  uri,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async client => {
    console.log('Connected to MongoDB Atlas successfully');
    try {
      await ReviewsDAO.injectDB(client);
      console.log('Database injection successful');
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    } catch (e) {
      console.error('Error during database operations:', e);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.stack);
    process.exit(1);
  });