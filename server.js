import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import User from './models/user.js';
import Category from './models/category.js';

// Initialize the app and define the port
const app = express();
const port = 5500;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// MongoDB connection string (ensure you replace with your correct credentials)
const uri = "mongodb+srv://storeDataUser:g1MfHieubCImPSXV@cluster0.noqzo.mongodb.net/e-Tendering?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    // Optionally log stack trace for detailed debugging:
    console.error(err.stack);
    // Decide whether to terminate the process or continue for further debugging
    // process.exit(1); Uncomment if you want the server to stop in production
  });

// Define the Tender Schema and Model
const tenderSchema = new mongoose.Schema({
  tender_id: { type: String, required: true, unique: true },
  tender_name: String,
  construction_from: Date,
  construction_to: Date,
  date_of_tender_notice: Date,
  date_of_tender_close: Date,
  date_of_tender_winner: Date,
  bidding_price: Number,
  tender_status: String,
  staff_id: String
}, { collection: 'TENDER' }); // Specify the collection name

const Tender = mongoose.model('TENDER', tenderSchema);

// Endpoint to save tender
app.post('/save_tender', (req, res) => {
  const tender = new Tender({ ...req.body, tender_id: 'TND-' + Date.now() }); // Generate new tender ID
  tender.save() // Save the tender document to the database
    .then(() => res.json({ message: 'Tender saved successfully' })) // Success response
    .catch((err) => {
      console.error('Error saving tender:', err); // Log the error
      res.status(500).json({ error: 'Error saving tender', details: err });
    }); // Error response
});

// Endpoint to find tenders
app.get('/find', (req, res) => {
  Tender.find() // Find all tenders in the TENDER collection
    .then(tenders => res.json(tenders)) // Return tenders as JSON
    .catch((err) => {
      console.error('Error fetching tenders:', err); // Log the error
      res.status(500).json({ error: 'Error fetching tenders', details: err });
    }); // Error response
});

// Endpoint to create user
app.post('/create_user', async (req, res) => {
  try {
    const { name, address, user_type, password, email, categories } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const user_id = 'USR-' + Date.now(); // Generate a new unique ID for each user
    const user = new User({ user_id, name, address, user_type, password, email, categories });
    await user.save();
    res.json({ message: 'User created successfully', user });
  } catch (err) {
    console.error('Error creating user:', err); // Log the error
    res.status(500).json({ error: 'Error creating user', details: err.message });
  }
});

// Endpoint to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('categories');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err); // Log the error
    res.status(500).json({ error: 'Error fetching users', details: err.message });
  }
});

// Endpoint to delete user
app.delete('/delete_user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    await User.findOneAndDelete({ user_id });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err); // Log the error
    res.status(500).json({ error: 'Error deleting user', details: err.message });
  }
});

// Endpoint to delete tender
app.delete('/delete_tender/:tender_id', async (req, res) => {
  try {
    const { tender_id } = req.params;
    await Tender.findOneAndDelete({ tender_id });
    res.json({ message: 'Tender deleted successfully' });
  } catch (err) {
    console.error('Error deleting tender:', err); // Log the error
    res.status(500).json({ error: 'Error deleting tender', details: err.message });
  }
});

// Endpoint to check connection to collections
app.get('/check_connection', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const categoryCount = await Category.countDocuments();
    res.json({ message: 'Connection successful', userCount, categoryCount });
  } catch (err) {
    console.error('Error checking connection:', err); // Log the error
    res.status(500).json({ error: 'Error checking connection', details: err.message });
  }
});

// Endpoint to create collections
app.get('/create_collections', async (req, res) => {
  try {
    await User.createCollection();
    await Category.createCollection();
    await Tender.createCollection();
    res.json({ message: 'Collections created successfully' });
  } catch (err) {
    console.error('Error creating collections:', err); // Log the error
    res.status(500).json({ error: 'Error creating collections', details: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
