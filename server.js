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

// MongoDB connection string
const uri = "mongodb+srv://storeDataUser:g1MfHieubCImPSXV@cluster0.noqzo.mongodb.net/e-Tendering?retryWrites=true&w=majority";

// MongoDB Connection
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
  tender_name: { type: String, required: true }, // Added validation
  construction_from: { type: Date, required: true }, // Added validation
  construction_to: { type: Date, required: true }, // Added validation
  date_of_tender_notice: { type: Date, required: true },
  date_of_tender_close: { type: Date, required: true },
  date_of_tender_winner: { type: Date },
  bidding_price: { type: Number, required: true, min: 0 }, // Enforced minimum
  tender_status: { type: String, enum: ['Open', 'Closed', 'Pending'], default: 'Pending' }, // Added validation
  staff_id: { type: String, required: true }
}, { collection: 'TENDER' });

const Tender = mongoose.model('TENDER', tenderSchema);

// Endpoint to save tender
<<<<<<< HEAD
app.post('/save_tender', async (req, res) => {
  try {
    const tender = new Tender(req.body); // Create a new tender instance
    await tender.save(); // Save the tender document
    res.json({ message: 'Tender saved successfully', tender }); // Return success response
=======
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
    const user_id = 'USR-' + Date.now(); // Generate a new unique ID for each user
    const user = new User({ user_id, name, address, user_type, password, email, categories });
    await user.save();
    res.json({ message: 'User created successfully', user });
>>>>>>> 6f48153e7bfd85dc5b39e8568515d70ba14620ca
  } catch (err) {
    console.error('Error saving tender:', err.message); // Log the error
    res.status(500).json({ error: 'Error saving tender', details: err.message }); // Return error response
  }
});

// Endpoint to fetch all tenders
app.get('/find', async (req, res) => {
  try {
    const tenders = await Tender.find(); // Fetch all tenders from the database
    res.json(tenders); // Send tenders as JSON
  } catch (err) {
    console.error('Error fetching tenders:', err.message); // Log the error
    res.status(500).json({ error: 'Error fetching tenders', details: err.message }); // Return error response
  }
});

// Endpoint to create a user
app.post('/create_user', async (req, res) => {
  try {
    const { user_id, name, address, user_type, password, email, categories } = req.body;

    // Check if a user with the same `user_id` or `email` already exists
    const existingUser = await User.findOne({ $or: [{ user_id }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with the provided ID or email' });
    }

    const user = new User({ user_id, name, address, user_type, password, email, categories });
    await user.save(); // Save the user document
    res.json({ message: 'User created successfully', user }); // Return success response
  } catch (err) {
    console.error('Error creating user:', err.message); // Log the error
    res.status(500).json({ error: 'Error creating user', details: err.message }); // Return error response
  }
});

// Endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('categories'); // Fetch users and populate `categories`
    res.json(users); // Send users as JSON
  } catch (err) {
    console.error('Error fetching users:', err.message); // Log the error
    res.status(500).json({ error: 'Error fetching users', details: err.message }); // Return error response
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
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please use a different port.`);
  } else {
    console.error('Server error:', err.message);
  }
});
