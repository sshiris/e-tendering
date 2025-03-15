import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import User from './models/user.js';
import Category from './models/category.js';
import Tender from './models/tender.js';
import Bid from './models/bid.js';

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
  .catch((err) => console.log('Failed to connect to MongoDB Atlas', err));

// Endpoint to save tender
app.post('/create_tender', (req, res) => {
  const { tender_id, tender_name, construction_from, construction_to, date_of_tender_notice, date_of_tender_close, date_of_tender_winner, bidding_price, tender_status, staff_id } = req.body;

  // Check for missing required fields
  if (!tender_id || !tender_name || !construction_from || !construction_to || !date_of_tender_notice || !date_of_tender_close || !bidding_price || !tender_status || !staff_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const tender = new Tender(req.body); // Create new tender from the request body
  tender.save() // Save the tender document to the database
    .then(() => res.json({ message: 'Tender saved successfully' })) // Success response
    .catch((err) => res.status(500).json({ error: 'Error saving tender', details: err })); // Error response
});

// Endpoint to find tenders
app.get('/tenders', (req, res) => {
  Tender.find() // Find all tenders in the TENDER collection
    .then(tenders => res.json(tenders)) // Return tenders as JSON
    .catch((err) => res.status(500).json({ error: 'Error fetching tenders', details: err })); // Error response
});

// Endpoint to create user
app.post('/create_user', async (req, res) => {
  try {
    const { user_id, name, address, user_type, password, email, categories } = req.body;
    const user = new User({ user_id, name, address, user_type, password, email, categories });
    await user.save();
    res.json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Error creating user', details: err.message });
  }
});

// Endpoint to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('categories');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users', details: err.message });
  }
});

// Endpoint to create category
app.post('/create_category', async (req, res) => {
  try {
    const { category_id, category_name } = req.body;
    const category = new Category({ category_id, category_name });
    await category.save();
    res.json({ message: 'Category created successfully', category });
  } catch (err) {
    res.status(500).json({ error: 'Error creating category', details: err.message });
  }
});

// Endpoint to get all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching categories', details: err.message });
  }
});

// Endpoint to create bid
app.post('/create_bid', async (req, res) => {
  try {
    const { bidder_id, tender_id, bidding_price, is_winner } = req.body;
    const bid = new Bid({ bidder_id, tender_id, bidding_price, is_winner });
    await bid.save();
    res.json({ message: 'Bid created successfully', bid });
  } catch (err) {
    res.status(500).json({ error: 'Error creating bid', details: err.message });
  }
});

// Endpoint to get all bids
app.get('/bids', async (req, res) => {
  try {
    const bids = await Bid.find().populate('bidder_id').populate('tender_id');
    res.json(bids);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bids', details: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});